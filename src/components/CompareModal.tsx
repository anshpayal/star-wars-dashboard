"use client";

import { useAtom } from "jotai";
import { selectedStarshipsAtom } from "@/store/starshipStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Ship, Users, Gauge, Factory, CodepenIcon } from "lucide-react";

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CompareModal({ isOpen, onClose }: CompareModalProps) {
  const [selectedStarships] = useAtom(selectedStarshipsAtom);

  const compareFields = [
    { key: 'model', label: 'Model', icon: <CodepenIcon className="h-4 w-4" /> },
    { key: 'manufacturer', label: 'Manufacturer', icon: <Factory className="h-4 w-4" /> },
    { key: 'crew', label: 'Crew Size', icon: <Users className="h-4 w-4" /> },
    { key: 'hyperdrive_rating', label: 'Hyperdrive Rating', icon: <Gauge className="h-4 w-4" /> },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[900px] p-0 overflow-hidden bg-white dark:bg-gray-800">
        <DialogHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
              <Ship className="h-5 w-5 text-indigo-500" />
              Compare Starships
            </DialogTitle>
            {/* <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button> */}
          </div>
        </DialogHeader>

        <div className="p-6">
          {selectedStarships.length < 2 ? (
            <div className="text-center py-8">
              <Ship className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Select at least two starships to compare.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {selectedStarships.map((starship) => (
                <div
                  key={starship.name}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600"
                >
                  <div className="bg-indigo-500 p-4">
                    <h3 className="text-lg font-semibold text-white truncate">
                      {starship.name}
                    </h3>
                  </div>

                  <div className="p-4 space-y-4">
                    {compareFields.map(({ key, label, icon }) => (
                      <div key={key} className="flex items-start gap-3">
                        <div className="mt-1 text-gray-400 dark:text-gray-500 flex-shrink-0">
                          {icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {label}
                          </p>
                          <p className="text-gray-900 dark:text-gray-100 break-words">
                            {starship[key as keyof typeof starship]}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-end">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 
                       bg-white dark:bg-gray-800 rounded-lg border border-gray-300 
                       dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 
                       dark:focus:ring-indigo-400 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
