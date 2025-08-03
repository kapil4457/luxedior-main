"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import Rating from "@mui/material/Rating";
import React, { useState } from "react";
import { addToast } from "@heroui/toast";
import { useDebounceCallback } from "@/config/hooks";

interface ReviewFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (review: {
    comment: string;
    rating: number;
  }) => Promise<void> | void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
}) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmit = useDebounceCallback(() => {
    if (comment == "") {
      addToast({
        title: "Please add a valid comment",
        radius: "none",
        color: "danger",
        variant: "solid",
      });
    } else if (rating == 0) {
      addToast({
        title: "Please add a valid rating",
        radius: "none",
        color: "danger",
        variant: "solid",
      });
    } else {
      if (onSubmit) {
        onSubmit({ comment, rating });
      }

      setComment("");
      setRating(0);
      onOpenChange(false);
    }
  });

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className="bg-[#191a1c] text-white"
    >
      <ModalContent>
        <ModalHeader className="text-lg font-bold text-white">
          Add Your Review
        </ModalHeader>
        <ModalBody className="space-y-4">
          <Textarea
            placeholder="Write your comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="bg-[#191a1c] text-white placeholder-[#191a1c]"
            rows={4}
          />
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-300">Your Rating:</span>
            <Rating
              value={rating}
              precision={1}
              onChange={(_, newValue) => setRating(newValue || 0)}
              sx={{
                color: "#f59e0b",
                "& .MuiRating-iconEmpty": {
                  color: "#ffffff",
                },
              }}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="ghost"
            onPress={() => onOpenChange(false)}
            className="text-gray-300 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
            onPress={handleSubmit}
          >
            Submit Review
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReviewForm;
