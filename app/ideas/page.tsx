"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import Image from "next/image";

interface IdeaSlate {
  id: string;
  title: string;
  author: string;
  itemCount: number;
  images: string[];
  category: string;
  tags: string[];
}

const allIdeaSlates: IdeaSlate[] = [
  {
    id: "1",
    title: "Indoor Aisle Inspiration for Your Winter Wedding",
    author: "Amanda",
    itemCount: 16,
    category: "Wedding",
    tags: ["winter", "indoor", "ceremony"],
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=400&h=300&fit=crop",
    ],
  },
  {
    id: "2",
    title: "Meeting Venue Inspiration for a Collaborative Corporate Gathering",
    author: "Jessica",
    itemCount: 19,
    category: "Corporate",
    tags: ["corporate", "meeting", "collaborative"],
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
    ],
  },
  {
    id: "3",
    title: "12 Birthday Party Ideas That Will Make This Year Count",
    author: "Amanda",
    itemCount: 12,
    category: "Birthday",
    tags: ["birthday", "party", "celebration"],
    images: [
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=300&fit=crop",
    ],
  },
  {
    id: "4",
    title: "Elegant Garden Wedding Reception Ideas",
    author: "Sarah",
    itemCount: 24,
    category: "Wedding",
    tags: ["garden", "outdoor", "reception", "elegant"],
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=400&h=300&fit=crop",
    ],
  },
  {
    id: "5",
    title: "Modern Conference Room Setup Ideas",
    author: "Michael",
    itemCount: 15,
    category: "Corporate",
    tags: ["conference", "modern", "setup", "tech"],
    images: [
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop",
    ],
  },
  {
    id: "6",
    title: "Baby Shower Decorations That Wow",
    author: "Emily",
    itemCount: 18,
    category: "Baby Shower",
    tags: ["baby shower", "decorations", "cute", "pastel"],
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=300&fit=crop",
    ],
  },
];

const categories = [
  "All",
  "Wedding",
  "Corporate",
  "Birthday",
  "Baby Shower",
  "Anniversary",
];

export default function IdeasPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredSlates, setFilteredSlates] = useState(allIdeaSlates);

  const handleSearch = () => {
    let filtered = allIdeaSlates;

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (slate) => slate.category === selectedCategory,
      );
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (slate) =>
          slate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          slate.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase()),
          ) ||
          slate.author.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredSlates(filtered);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="italic text-gray-600">Featured</span>{" "}
            <span className="text-black">Idea Slates</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover curated collections of event inspiration from our expert
            team
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="flex gap-2">
                <Input
                  placeholder="Search idea slates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button onClick={handleSearch} size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="md:w-48">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredSlates.length} idea slate
            {filteredSlates.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Slates Grid */}
        {filteredSlates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSlates.map((slate) => (
              <Card
                key={slate.id}
                className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              >
                <CardContent className="p-0">
                  {/* Image Grid */}
                  <div className="grid grid-cols-2 gap-1 aspect-square">
                    {slate.images.map((image, index) => (
                      <div
                        key={index}
                        className="relative overflow-hidden bg-gray-200"
                      >
                        <Image
                          src={image}
                          alt={`${slate.title} image ${index + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-2">
                      <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                        {slate.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg mb-3 leading-tight">
                      {slate.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>by {slate.author}</span>
                      <span>• {slate.itemCount} items</span>
                    </div>
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-1">
                        {slate.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-semibold mb-2">
                No idea slates found
              </h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or category filter
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                  setFilteredSlates(allIdeaSlates);
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
