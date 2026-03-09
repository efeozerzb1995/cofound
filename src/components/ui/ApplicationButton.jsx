import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ApplicationButton({ 
  onApplicationSubmit,
  projectId,
  className = ""
}) {
  const [buttonState, setButtonState] = useState({
    text: 'Başvur →',
    backgroundColor: '#10B981',
    textColor: '#FFFFFF',
    isDisabled: false,
    isLoading: false
  });

  const handleClick = async () => {
    // Step 1: Update to loading state
    setButtonState({
      text: 'Yükleniyor...',
      backgroundColor: '#10B981',
      textColor: '#FFFFFF',
      isDisabled: true,
      isLoading: true
    });

    // Step 2: Simulate backend delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Step 3: Update to completed state
    setButtonState({
      text: 'Başvuruldu ✓',
      backgroundColor: '#1F2937',
      textColor: '#FFFFFF',
      isDisabled: true,
      isLoading: false
    });

    // Step 4: Show success notification
    toast.success('Başarılı!', {
      description: 'Proje başvurunuz başarıyla iletildi.',
      duration: 3000,
    });

    // Call parent callback if provided
    if (onApplicationSubmit) {
      onApplicationSubmit(projectId);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={buttonState.isDisabled}
      className={`font-semibold transition-all ${className}`}
      style={{
        backgroundColor: buttonState.backgroundColor,
        color: buttonState.textColor,
      }}
    >
      {buttonState.isLoading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      {buttonState.text}
    </Button>
  );
}