import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const PriceManagement = () => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [prices, setPrices] = useState({
    weekly_price: "",
    daily_price: "",
    cleaning_price: "",
    bedding_price: "",
  });

  const { data: pricesData, isLoading } = useQuery({
    queryKey: ["prices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prices")
        .select("key, value");
      
      if (error) throw error;
      return data || [];
    },
  });

  const updatePriceMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: number }) => {
      const { error } = await supabase
        .from("prices")
        .update({ value })
        .eq("key", key);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prices"] });
    },
  });

  useEffect(() => {
    if (Array.isArray(pricesData) && pricesData.length > 0) {
      const priceObj: { [key: string]: string } = {};
      pricesData.forEach(({ key, value }) => {
        priceObj[key] = value.toString();
      });
      setPrices(priceObj as typeof prices);
    }
  }, [pricesData]);

  const handlePriceChange = (key: keyof typeof prices) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrices(prev => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      for (const [key, value] of Object.entries(prices)) {
        await updatePriceMutation.mutateAsync({
          key,
          value: parseInt(value),
        });
      }
      
      toast({
        title: "Suksess",
        description: "Priser oppdatert",
      });
    } catch (error) {
      console.error("Feil ved oppdatering av priser:", error);
      toast({
        title: "Feil",
        description: "Kunne ikke oppdatere priser",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Laster priser...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Priser</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="flex flex-col space-y-2">
            <label>Ukeleie</label>
            <div className="relative">
              <Input
                value={prices.weekly_price}
                onChange={handlePriceChange("weekly_price")}
                placeholder="4000"
                type="number"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                NOK
              </span>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <label>Døgnpris</label>
            <div className="relative">
              <Input
                value={prices.daily_price}
                onChange={handlePriceChange("daily_price")}
                placeholder="800"
                type="number"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                NOK
              </span>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <label>Utvask</label>
            <div className="relative">
              <Input
                value={prices.cleaning_price}
                onChange={handlePriceChange("cleaning_price")}
                placeholder="600"
                type="number"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                NOK
              </span>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <label>Sengetøy & håndduker (per pers. per opphold)</label>
            <div className="relative">
              <Input
                value={prices.bedding_price}
                onChange={handlePriceChange("bedding_price")}
                placeholder="100"
                type="number"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                NOK
              </span>
            </div>
          </div>
        </div>
        <Button onClick={handleSave} className="w-full">
          Lagre endringer
        </Button>
      </CardContent>
    </Card>
  );
};