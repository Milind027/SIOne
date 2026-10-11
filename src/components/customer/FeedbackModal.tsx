import React, { useState } from 'react';
import { useRestaurant } from '../../store/restaurantStore';
import { MessageSquareHeart, Check, X, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EMOJI_RATINGS = [
  { rating: 5, emoji: '😍', labelEn: 'Exceptional', labelHi: 'लाजवाब' },
  { rating: 4, emoji: '😃', labelEn: 'Good', labelHi: 'बढ़िया' },
  { rating: 3, emoji: '😐', labelEn: 'Average', labelHi: 'सामान्य' },
  { rating: 2, emoji: '🙁', labelEn: 'Needs Care', labelHi: 'सुधार चाहिए' },
  { rating: 1, emoji: '😡', labelEn: 'Poor', labelHi: 'खराब' },
];

const FEEDBACK_TAGS = [
  { en: 'Paneer Tikka Taste', hi: 'पनीर टिक्का स्वाद' },
  { en: 'Hot Butter Naan', hi: 'गरमा-गरम नान' },
  { en: 'Fast Kitchen Speed', hi: 'तेज़ सर्विस' },
  { en: 'Kitchen Cleanliness', hi: 'साफ़-सफ़ाई' },
  { en: 'Staff Courtesy', hi: 'स्टाफ का व्यवहार' },
  { en: 'Music & Ambiance', hi: 'माहौल व संगीत' },
];

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const { tableNumber, submitFeedback, t } = useRestaurant();
  const [selectedRating, setSelectedRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Paneer Tikka Taste', 'Fast Kitchen Speed']);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitFeedback(selectedRating, selectedTags, comment);
    setIsSubmitted(true);
    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch {
      // ignore
    }
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl border border-[#dadce0] text-[#202124] space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#dadce0]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center font-bold">
              <MessageSquareHeart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#202124]">
                {t('Anonymous Table Feedback', 'बिना नाम, सच्चा फीडबैक')}
              </h3>
              <p className="text-xs text-[#5f6368]">
                {t(`Confidential · Table ${tableNumber}`, `गोपनीय · Table ${tableNumber}`)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#e6f4ea] text-[#137333] mx-auto flex items-center justify-center">
              <Check className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h4 className="text-base font-bold text-[#202124]">
              {t('Feedback Submitted Directly to Chef!', 'फीडबैक सीधा किचन तक पहुँच गया!')}
            </h4>
            <p className="text-xs text-[#5f6368]">
              {t('Thank you for helping us improve our culinary craft.', 'आपकी राय से हमें सेवा बेहतर बनाने में मदद मिलती है।')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Emoji Rating Row */}
            <div className="space-y-1.5 text-center">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#5f6368]">
                {t('How was your dining experience today?', 'खाना व अनुभव कैसा लगा?')}
              </label>
              <div className="flex justify-between items-center px-2 pt-1">
                {EMOJI_RATINGS.map((item) => (
                  <button
                    key={item.rating}
                    type="button"
                    onClick={() => setSelectedRating(item.rating)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                      selectedRating === item.rating
                        ? 'bg-[#e8f0fe] ring-1 ring-[#1a73e8] scale-105'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl">{item.emoji}</span>
                    <span className="text-[10px] font-semibold text-[#202124]">
                      {t(item.labelEn, item.labelHi)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Tags */}
            <div className="space-y-1 pt-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#5f6368]">
                {t('What stood out? (Select tags)', 'खास क्या लगा?')}
              </label>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {FEEDBACK_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag.en);
                  return (
                    <button
                      key={tag.en}
                      type="button"
                      onClick={() => toggleTag(tag.en)}
                      className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                        isSelected
                          ? 'bg-[#1a73e8] text-white font-semibold'
                          : 'bg-[#f1f3f4] text-[#5f6368] hover:bg-[#e8eaed]'
                      }`}
                    >
                      {t(tag.en, tag.hi)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comment textarea */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#5f6368]">
                {t('Message for Floor Manager / Chef', 'शेफ के लिए कोई टिप्पणी')}
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t('Tell us how we can make your next meal even better...', 'अपना सुझाव लिखें...')}
                className="w-full p-2.5 text-xs rounded-lg border border-[#dadce0] bg-[#f8f9fa] text-[#202124] focus:outline-hidden focus:ring-1 focus:ring-[#1a73e8] resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-[#1a73e8] hover:bg-[#1765c9] text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{t('Send Anonymous Feedback', 'गुमनाम फीडबैक भेजें')}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
