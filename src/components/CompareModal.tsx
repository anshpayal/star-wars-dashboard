"use client";

import { useAtom } from "jotai";
import { selectedStarshipsAtom } from "@/store/starshipStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CompareModal({ isOpen, onClose }: CompareModalProps) {
  const [selectedStarships] = useAtom(selectedStarshipsAtom);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Compare Starships</DialogTitle>
        </DialogHeader>

        {selectedStarships.length < 2 ? (
          <p className="text-gray-500">
            Select at least two starships to compare.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedStarships.map((starship) => (
              <div
                key={starship.name}
                className="border p-4 rounded-lg shadow-md bg-gray-50"
              >
                <h3 className="text-lg font-semibold">{starship.name}</h3>
                <p>
                  <strong>Model:</strong> {starship.model}
                </p>
                <p>
                  <strong>Manufacturer:</strong> {starship.manufacturer}
                </p>
                <p>
                  <strong>Crew Size:</strong> {starship.crew}
                </p>
                <p>
                  <strong>Hyperdrive Rating:</strong>{" "}
                  {starship.hyperdrive_rating}
                </p>
              </div>
            ))}
          </div>
        )}

        <DialogClose asChild>
          <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
            Close
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
