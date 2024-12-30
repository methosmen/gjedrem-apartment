import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/hooks/useLanguage";

interface BookingFieldsProps {
  name: string;
  email: string;
  phone: string;
  comment: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onCommentChange: (value: string) => void;
}

export const BookingFields = ({
  name,
  email,
  phone,
  comment,
  onNameChange,
  onEmailChange,
  onPhoneChange,
  onCommentChange,
}: BookingFieldsProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">{t('booking.name')} *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">{t('booking.email')} *</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">{t('booking.phone')}</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="comment">{t('booking.comment')}</Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
          rows={4}
        />
      </div>
    </div>
  );
};