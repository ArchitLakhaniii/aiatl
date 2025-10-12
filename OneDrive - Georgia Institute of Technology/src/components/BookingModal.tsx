import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Separator } from './ui/separator';
import { Check, Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  listing: {
    title: string;
    host: string;
    price: number;
    location: string;
  };
  onConfirm: () => void;
}

export function BookingModal({ open, onClose, listing, onConfirm }: BookingModalProps) {
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [confirmed, setConfirmed] = useState(false);

  const nights = checkIn && checkOut 
    ? Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const subtotal = nights * listing.price;
  const serviceFee = subtotal * 0.1;
  const total = subtotal + serviceFee;

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => {
      onConfirm();
      setConfirmed(false);
      onClose();
    }, 2000);
  };

  if (confirmed) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md bg-white dark:bg-gray-900 color:bg-gradient-to-br color:from-purple-50 color:to-pink-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center py-8"
          >
            <div className="w-20 h-20 rounded-full bg-teal-100 dark:bg-teal-900 color:bg-purple-200 flex items-center justify-center mb-4">
              <Check className="w-10 h-10 text-teal-600 dark:text-teal-400 color:text-purple-700" />
            </div>
            <h2 className="text-gray-900 dark:text-gray-100 color:text-purple-900 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600 dark:text-gray-400 color:text-purple-700 text-center">
              Your stay at {listing.title} has been confirmed. Check your dashboard for details.
            </p>
          </motion.div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 color:bg-gradient-to-br color:from-purple-50 color:to-pink-50">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100 color:text-purple-900">
            Complete Your Booking
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-gray-900 dark:text-gray-100 color:text-purple-900 mb-1">{listing.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 color:text-purple-700">
              Hosted by {listing.host} · {listing.location}
            </p>
          </div>

          <Separator />

          <div>
            <div className="flex items-center gap-2 mb-4">
              <CalendarIcon className="w-5 h-5 text-teal-600 dark:text-teal-400 color:text-purple-600" />
              <h4 className="text-gray-900 dark:text-gray-100 color:text-purple-900">Select Dates</h4>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-700 dark:text-gray-300 color:text-purple-800 block mb-2">Check-in</label>
                <Calendar
                  mode="single"
                  selected={checkIn}
                  onSelect={setCheckIn}
                  className="rounded-lg border border-gray-200 dark:border-gray-700 color:border-purple-300 p-3 bg-white dark:bg-gray-800 color:bg-white/80"
                  disabled={(date) => date < new Date()}
                />
              </div>
              <div>
                <label className="text-gray-700 dark:text-gray-300 color:text-purple-800 block mb-2">Check-out</label>
                <Calendar
                  mode="single"
                  selected={checkOut}
                  onSelect={setCheckOut}
                  className="rounded-lg border border-gray-200 dark:border-gray-700 color:border-purple-300 p-3 bg-white dark:bg-gray-800 color:bg-white/80"
                  disabled={(date) => !checkIn || date <= checkIn}
                />
              </div>
            </div>
          </div>

          {nights > 0 && (
            <>
              <Separator />
              
              <div className="space-y-3">
                <h4 className="text-gray-900 dark:text-gray-100 color:text-purple-900">Price Summary</h4>
                
                <div className="space-y-2 text-gray-700 dark:text-gray-300 color:text-purple-800">
                  <div className="flex justify-between">
                    <span>${listing.price} × {nights} nights</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service fee</span>
                    <span>${serviceFee.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleConfirm}
                className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-800 color:bg-purple-600 color:hover:bg-purple-700 text-white"
              >
                Confirm Booking
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
