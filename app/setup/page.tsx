"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function SetupPage() {
  const initializeCollections = useMutation(api.collections.initializeDefaultCollections);
  const ensureHomePageExists = useMutation(api.pages.ensureHomePageExists);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleInitialize = async () => {
    setIsInitializing(true);
    try {
      await initializeCollections();
      await ensureHomePageExists();
      toast.success("Default collections and home page initialized successfully!");
      setIsComplete(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to initialize");
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Setup Your Site</CardTitle>
          <CardDescription>
            Initialize the default collections and home page to get started with your dynamic content system.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isComplete ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <CheckCircle className="w-16 h-16 text-green-500" />
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Setup Complete!</h3>
                <p className="text-muted-foreground mb-4">
                  Default collections have been initialized. You can now manage them from the admin panel.
                </p>
                <Button  className="w-full">
                  <Link href="/admin/collections">Go to Admin Collections</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">This will create:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Home page (root route /)</li>
                  <li>• Services collection</li>
                  <li>• Projects collection</li>
                  <li>• Team collection</li>
                  <li>• Products collection</li>
                </ul>
              </div>
              <Button 
                onClick={handleInitialize} 
                disabled={isInitializing}
                className="w-full"
                size="lg"
              >
                {isInitializing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Initializing...
                  </>
                ) : (
                  "Initialize Site"
                )}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                You can also initialize collections from the admin panel later.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}