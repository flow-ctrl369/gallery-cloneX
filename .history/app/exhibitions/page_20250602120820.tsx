"use client";

import { useState } from "react";
import { exhibitions } from "@/lib/exhibitions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion"

export default function ExhibitionsPage() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredExhibitions = exhibitions.filter((exhibition) => {
    if (activeTab === "all") return true;
    return exhibition.status === activeTab;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-4xl font-bold mb-4 uppercase tracking-wider relative inline-block"
        >
          Exhibitions
          <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
        </motion.h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover our current, upcoming, and past exhibitions showcasing exceptional artwork
          from talented artists around the world.
        </p>
      </div>

      <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="current">Current</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExhibitions.map((exhibition) => (
              <Card key={exhibition.id} className="overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image
                    src={exhibition.image}
                    alt={exhibition.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{exhibition.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{exhibition.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>
                        {new Date(exhibition.startDate).toLocaleDateString()} -{" "}
                        {new Date(exhibition.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{exhibition.location}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Users className="w-4 h-4 mr-2" />
                      <span>Curated by {exhibition.curator}</span>
                    </div>
                  </div>

                  <Button asChild className="w-full">
                    <Link href={`/exhibitions/${exhibition.id}`}>
                      View Exhibition
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
