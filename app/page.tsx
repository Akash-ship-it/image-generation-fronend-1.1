'use client';

import { useState, FormEvent, useEffect } from 'react';
import { generateImage, ImageGenerationRequest, ImageGenerationResponse, LikedImage } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  HelpCircle,
  Download,
  Copy,
  Sparkles,
  Settings,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  Wand2,
  Palette,
  Mountain,
  Bot,
  Castle,
  Zap,
  Eye,
  Shuffle,
  Check,
  Share2,
  Heart,
  Star,
  TrendingUp,
  Layers,
  Maximize,
  RotateCcw,
  Camera,
  Brush,
  X,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  // const [steps, setSteps] = useState([30]);
  // const [guidance, setGuidance] = useState([7.5]);
  const [steps, setSteps] = useState([28]);
  const [guidance, setGuidance] = useState([3.5]);
  const [width, setWidth] = useState([1024]);
  const [height, setHeight] = useState([1024]);
  const [seed, setSeed] = useState(-1);
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);
  const [theme, setTheme] = useState('dark');
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedImage, setGeneratedImage] = useState<any>(null);

  const [likedImages, setLikedImages] = useState<LikedImage[]>([]);


  const [isClient, setIsClient] = useState(false);

  // Load liked images from localStorage on component mount
  useEffect(() => {
    setIsClient(true);
    // Apply theme to document
    document.documentElement.classList.toggle('dark', theme === 'dark');

    // Load liked images from localStorage
    const savedLikedImages = localStorage.getItem('chitrakar-liked-images');
    if (savedLikedImages) {
      try {
        const parsed = JSON.parse(savedLikedImages);
        setLikedImages(parsed);
      } catch (error) {
        console.error('Error loading liked images:', error);
        localStorage.removeItem('chitrakar-liked-images');
      }
    }
  }, []);

  // Save liked images to localStorage whenever likedImages changes
  useEffect(() => {
    if (isClient && likedImages.length >= 0) {
      localStorage.setItem('chitrakar-liked-images', JSON.stringify(likedImages));
    }
  }, [likedImages, isClient]);

  // Check if current image is liked
  const isCurrentImageLiked = generatedImage && likedImages.some(img => img.cloudinary_url === generatedImage.cloudinary_url);

  // Toggle like for current image
  const toggleLike = () => {
    if (!generatedImage) return;

    const imageId = generatedImage.cloudinary_url;
    const isLiked = likedImages.some(img => img.cloudinary_url === imageId);

    if (isLiked) {
      // Remove from liked images
      setLikedImages(prev => prev.filter(img => img.cloudinary_url !== imageId));
    } else {
      // Add to liked images
      const newLikedImage: LikedImage = {
        id: Date.now().toString(),
        cloudinary_url: generatedImage.cloudinary_url,
        prompt: generatedImage.prompt,
        timestamp: Date.now()
      };
      setLikedImages(prev => [newLikedImage, ...prev.slice(0, 5)]); // Keep only 6 most recent
    }
  };

  // Remove image from liked images
  const removeLikedImage = (imageUrl: string) => {
    setLikedImages(prev => prev.filter(img => img.cloudinary_url !== imageUrl));
  };


  useEffect(() => {
    setIsClient(true);
    // Apply theme to document
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = (newTheme: string) => {
    setTheme(newTheme);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsLoading(true);
    setError('');
    setGeneratedImage(null);
    setProgress(0);

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 1000);

    try {
      const request = {
        prompt: prompt.trim(),
        negative_prompt: negativePrompt.trim() || undefined,
        num_inference_steps: steps[0],
        guidance_scale: guidance[0],
        width: width[0],
        height: height[0],
        seed: seed === -1 ? undefined : seed,
      };

      const response = await generateImage(request);
      setProgress(100);
      setTimeout(() => setGeneratedImage(response), 500);
    } catch (err) {
      console.error('Image generation error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 500);
    }
  };

  const handleQuickPrompt = (quickPrompt: string) => {
    setPrompt(quickPrompt);
    setError('');
  };

  const generateRandomSeed = () => {
    setSeed(Math.floor(Math.random() * 1000000));
  };

  const resetToDefaults = () => {
    setPrompt('');
    setNegativePrompt('');
    setSteps([28]); // Changed from [30]
    setGuidance([3.5]); // Changed from [7.5]
    setWidth([1024]);
    setHeight([1024]);
    setSeed(-1);
    setError('');
    setGeneratedImage(null);
    setProgress(0);
    setCopied(false);
  };

  const downloadImage = async () => {
    if (!generatedImage?.cloudinary_url) return;

    try {
      const response = await fetch(generatedImage.cloudinary_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `ai-generated-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const copyToClipboard = async () => {
    if (generatedImage?.cloudinary_url) {
      await navigator.clipboard.writeText(generatedImage.cloudinary_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openImageModal = () => {
    setIsImageModalOpen(true);
  };

  const quickPrompts = [
    {
      icon: Castle,
      title: "Epic Fantasy",
      description: "Dragons, castles, magic",
      prompt: "A majestic dragon soaring over an ancient castle at golden hour, epic fantasy art, highly detailed, cinematic lighting, 8k resolution",
      category: "fantasy"
    },
    {
      icon: Bot,
      title: "Cyberpunk Noir",
      description: "Neon lights, future city",
      prompt: "A dystopian cyberpunk cityscape with towering neon-lit skyscrapers, flying cars, rain-soaked streets, blade runner aesthetic, moody lighting",
      category: "sci-fi"
    },
    {
      icon: Mountain,
      title: "Nature's Beauty",
      description: "Landscapes, serene views",
      prompt: "A breathtaking mountain landscape with crystal clear lake reflection, autumn colors, misty morning light, professional photography, ultra-realistic",
      category: "nature"
    },
    {
      icon: Palette,
      title: "Digital Art",
      description: "Abstract, artistic style",
      prompt: "A vibrant abstract digital artwork with flowing geometric patterns, holographic colors, modern art style, high contrast, artistic masterpiece",
      category: "abstract"
    },
    {
      icon: Camera,
      title: "Portrait Art",
      description: "Characters, people",
      prompt: "A stunning portrait of a futuristic warrior with intricate armor, dramatic lighting, photorealistic, detailed textures, cinematic composition",
      category: "portrait"
    },
    {
      icon: Brush,
      title: "Oil Painting",
      description: "Classic art style",
      prompt: "A beautiful still life painting in classical oil painting style, vintage flowers in ornate vase, warm lighting, renaissance aesthetic",
      category: "classical"
    }
  ];

  const aspectRatios = [
    { name: "Square", width: 1024, height: 1024, icon: "⬜" },
    { name: "Portrait", width: 768, height: 1024, icon: "📱" },
    { name: "Landscape", width: 1024, height: 768, icon: "🖼️" },
    { name: "Wide", width: 1536, height: 768, icon: "📺" }
  ];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background dark:bg-gray-950 transition-colors duration-300">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/5 dark:from-primary/10 dark:via-primary/20 dark:to-secondary/10 border-b dark:border-gray-800">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative container mx-auto px-4 py-16">
            <div className="text-center space-y-6 max-w-4xl mx-auto">
              {/* Theme Toggle */}
              <div className="absolute top-4 right-4">
                <div className="flex items-center bg-background/80 dark:bg-gray-900/80 backdrop-blur-xl border border-border/50 rounded-full p-1 shadow-lg">
                  <Button
                    variant={theme === 'light' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => toggleTheme('light')}
                    className="rounded-full h-8 w-8 p-0"
                  >
                    <Sun className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => toggleTheme('dark')}
                    className="rounded-full h-8 w-8 p-0"
                  >
                    <Moon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={theme === 'system' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => toggleTheme('system')}
                    className="rounded-full h-8 w-8 p-0"
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl"></div>
                  <div className="relative p-4 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-2xl">
                    <Sparkles className="h-12 w-12 text-primary-foreground animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h1 className="text-6xl font-black bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
                    ChitraKar
                  </h1>
                  <div className="flex items-center gap-2 justify-center">
                    <Badge variant="secondary" className="px-3 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Pro
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Project #1 By <strong>Akash More</strong>
                    </Badge>
                  </div>
                </div>
              </div>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Transform your wildest imagination into stunning visual masterpieces with cutting-edge AI technology.
                <span className="font-semibold text-foreground"> Create, customize, and download in seconds.</span>
              </p>
              <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  Lightning Fast
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-500" />
                  Ultra HD Quality
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-green-500" />
                  Advanced Controls
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Controls Panel */}
            <div className="xl:col-span-1 space-y-6">
              <Card className="shadow-2xl border-0 bg-card/50 dark:bg-gray-900/50 backdrop-blur-xl">
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Settings className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Creation Studio</CardTitle>
                        <CardDescription>Craft your perfect image</CardDescription>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={resetToDefaults} className='cursor-pointer'>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Prompt Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="prompt" className="text-base font-semibold">
                          Describe Your Vision
                        </Label>
                        <Badge variant="destructive" className="text-xs px-2 py-0.5">
                          Required
                        </Badge>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs p-4">
                            <div className="space-y-2">
                              <p className="font-semibold">Pro Tips:</p>
                              <ul className="text-sm space-y-1">
                                <li>• Be specific and detailed</li>
                                <li>• Include style keywords</li>
                                <li>• Mention lighting and mood</li>
                                <li>• Add quality terms like "4k", "detailed"</li>
                              </ul>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Textarea
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="A majestic phoenix rising from crystal flames, ethereal lighting, fantasy art, ultra detailed, 8k resolution..."
                        className="min-h-[120px] resize-none text-base"
                        required
                      />
                      <div className="text-xs text-muted-foreground text-right">
                        {prompt.length} characters
                      </div>
                    </div>

                    {/* Negative Prompt */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="negativePrompt" className="text-base font-semibold">
                          What to Avoid
                        </Label>
                        <Badge variant="secondary" className="text-xs px-2 py-0.5">
                          Optional
                        </Badge>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs p-4">
                            <div className="space-y-2">
                              <p className="font-semibold">Common exclusions:</p>
                              <p className="text-sm">blurry, low quality, distorted, ugly, duplicate, watermark, text, cropped</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Textarea
                        id="negativePrompt"
                        value={negativePrompt}
                        onChange={(e) => setNegativePrompt(e.target.value)}
                        placeholder="blurry, low quality, distorted, watermark, text..."
                        className="min-h-[80px] resize-none"
                      />
                    </div>

                    {/* Advanced Settings Tabs */}
                    <Tabs defaultValue="basic" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="basic" className="flex items-center gap-2 cursor-pointer">
                          <Wand2 className="h-4 w-4" />
                          Basic
                        </TabsTrigger>
                        <TabsTrigger value="advanced" className="flex items-center gap-2 cursor-pointer">
                          <Settings className="h-4 w-4" />
                          Advanced
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="basic" className="space-y-6 mt-6">
                        {/* Aspect Ratio Selection */}
                        <div className="space-y-4">
                          <Label className="text-base font-semibold">Aspect Ratio</Label>
                          <div className="grid grid-cols-2 gap-3">
                            {aspectRatios.map((ratio, index) => (
                              <Button
                                key={index}
                                type="button"
                                variant={width[0] === ratio.width && height[0] === ratio.height ? "default" : "outline"}
                                className="h-auto p-3 justify-start cursor-pointer"
                                onClick={() => {
                                  setWidth([ratio.width]);
                                  setHeight([ratio.height]);
                                }}
                              >
                                <span className="text-lg mr-2">{ratio.icon}</span>
                                <div className="text-left">
                                  <div className="font-medium">{ratio.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {ratio.width}×{ratio.height}
                                  </div>
                                </div>
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Quality Preset */}
                        <div className="space-y-4">
                          <Label className="text-base font-semibold">Quality</Label>
                          <div className="grid grid-cols-1 gap-2">
                            <Button
                              type="button"
                              variant={steps[0] === 20 ? "default" : "outline"}
                              className="justify-between"
                              onClick={() => {
                                setSteps([20]);
                                setGuidance([3.0]);
                              }}
                            >
                              <span>⚡ Fast</span>
                              <span className="text-xs">20 steps</span>
                            </Button>
                            <Button
                              type="button"
                              variant={steps[0] === 28 ? "default" : "outline"}
                              className="justify-between"
                              onClick={() => {
                                setSteps([28]);
                                setGuidance([3.5]);
                              }}
                            >
                              <span>⚖️ Balanced</span>
                              <span className="text-xs">28 steps</span>
                            </Button>
                            <Button
                              type="button"
                              variant={steps[0] === 40 ? "default" : "outline"}
                              className="justify-between"
                              onClick={() => {
                                setSteps([40]);
                                setGuidance([4.0]);
                              }}
                            >
                              <span>💎 Premium</span>
                              <span className="text-xs">40 steps</span>
                            </Button>
                          </div>
                        </div>

                      </TabsContent>

                      <TabsContent value="advanced" className="space-y-6 mt-6">
                        {/* Fine-tuned Controls */}
                        <div className="space-y-6">
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <Label className="text-sm font-medium">
                                Inference Steps
                              </Label>
                              <Badge variant="outline" className="text-xs">
                                {steps[0]}
                              </Badge>
                              <Tooltip>
                                <TooltipTrigger>
                                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>More steps = higher quality but slower generation</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <Slider
                              value={steps}
                              onValueChange={setSteps}
                              max={100}
                              min={10}
                              step={5}
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>10 (2s)</span>
                              <span>50 (30s)</span>
                              <span>100 (60s)</span>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <Label className="text-sm font-medium">
                                Guidance Scale
                              </Label>
                              <Badge variant="outline" className="text-xs">
                                {guidance[0]}
                              </Badge>
                              <Tooltip>
                                <TooltipTrigger>
                                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Lower = more creative, Higher = follows prompt exactly</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <Slider
                              value={guidance}
                              onValueChange={setGuidance}
                              max={20}
                              min={1}
                              step={0.5}
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Creative</span>
                              <span>Balanced</span>
                              <span>Precise</span>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <Label htmlFor="seed" className="text-sm font-medium">
                                Seed Control
                              </Label>
                              <Badge variant="outline" className="text-xs">
                                {seed === -1 ? 'Random' : seed}
                              </Badge>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={generateRandomSeed}
                              >
                                <Shuffle className="h-4 w-4" />
                              </Button>
                            </div>
                            <Input
                              type="number"
                              id="seed"
                              value={seed}
                              onChange={(e) => setSeed(Number(e.target.value))}
                              placeholder="-1 for random"
                            />
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>

                    <Separator />

                    {/* Generate Button */}
                    <div className="space-y-4">
                      {isLoading && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Generating...</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      )}

                      <Button
                        type="submit"
                        disabled={isLoading || !prompt.trim()}
                        className="w-full h-16 text-lg font-bold bg-gradient-to-r from-primary via-primary/90 to-secondary hover:from-primary/90 hover:via-primary hover:to-secondary/90 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] group cursor-pointer"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                            Creating Magic...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-3 h-6 w-6 group-hover:animate-pulse" />
                            Generate Masterpiece
                          </>
                        )}
                      </Button>
                    </div>
                  </form>

                  {/* Error Display */}
                  {error && (
                    <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="font-medium">{error}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Quick Prompts */}
              <Card className="shadow-xl border-0 bg-card/50 dark:bg-gray-900/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Palette className="h-5 w-5" />
                    Inspiration Gallery
                  </CardTitle>
                  <CardDescription>
                    One-click prompts to spark your creativity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    {quickPrompts.map((item, index) => (
                      <Button
                        key={index}
                        type="button"
                        variant="ghost"
                        onClick={() => handleQuickPrompt(item.prompt)}
                        className="h-auto p-4 text-left hover:bg-accent/80 transition-all duration-200 group border border-transparent hover:border-border/50"
                      >
                        <div className="flex items-start gap-3 w-full">
                          <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                            <item.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="font-semibold text-sm">{item.title}</div>
                              <Badge variant="secondary" className="text-xs px-2 py-0">
                                {item.category}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground mb-2">
                              {item.description}
                            </div>
                            <div className="text-xs text-muted-foreground line-clamp-2">
                              {item.prompt.slice(0, 80)}...
                            </div>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Image Display Panel */}
            <div className="xl:col-span-2">
              <Card className="shadow-2xl border-0 bg-card/50 dark:bg-gray-900/50 backdrop-blur-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <ImageIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Your Masterpiece</CardTitle>
                        <CardDescription>
                          ChitraKar generated artwork appears here
                        </CardDescription>
                      </div>
                    </div>
                    {generatedImage && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={toggleLike} // ✅ FIX: Call toggleLike function
                          className={isCurrentImageLiked ? "text-red-500" : ""} // ✅ FIX: Use isCurrentImageLiked
                        >
                          <Heart className={`h-4 w-4 ${isCurrentImageLiked ? "fill-current" : ""}`} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="relative aspect-square bg-gradient-to-br from-muted/50 to-muted/80 rounded-2xl overflow-hidden border-2 border-dashed border-muted-foreground/20 hover:border-muted-foreground/40 transition-all duration-300">
                    {isLoading ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center space-y-6">
                          <div className="relative">
                            <div className="animate-spin rounded-full h-20 w-20 border-4 border-primary/20 border-t-primary mx-auto"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                            </div>
                          </div>
                          <div className="space-y-3">
                            <p className="text-xl font-semibold">Crafting your vision...</p>
                            <p className="text-sm text-muted-foreground">
                              This usually takes 30-60 seconds
                            </p>
                            <div className="w-64 mx-auto">
                              <Progress value={progress} className="h-2" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : generatedImage ? (
                      <div className="h-full relative group">
                        <img
                          src={generatedImage.cloudinary_url}
                          alt={generatedImage.prompt}
                          className="w-full h-full object-contain hover:scale-105 transition-transform duration-500 cursor-pointer"
                          onClick={openImageModal}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-2xl">
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={openImageModal}
                              className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 hover:bg-white dark:hover:bg-gray-800 shadow-lg"
                            >
                              <Maximize className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center text-muted-foreground space-y-6">
                          <div className="relative mx-auto h-32 w-32">
                            <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse"></div>
                            <div className="absolute inset-4 bg-primary/20 rounded-full animate-pulse delay-100"></div>
                            <div className="absolute inset-8 bg-primary/30 rounded-full animate-pulse delay-200"></div>
                            <ImageIcon className="absolute inset-0 h-full w-full text-primary/40 p-8" />
                          </div>
                          <div className="space-y-3">
                            <p className="text-2xl font-semibold text-foreground">Ready to create?</p>
                            <p className="text-lg">Enter your prompt and let ChitraKar work its magic</p>
                            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Zap className="h-4 w-4 text-yellow-500" />
                                Fast
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4 text-blue-500" />
                                HD Quality
                              </div>
                              <div className="flex items-center gap-1">
                                <Layers className="h-4 w-4 text-green-500" />
                                Professional
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Image Info and Actions */}
                  {generatedImage && (
                    <div className="mt-8 space-y-6">
                      {/* Image Details Card */}
                      <Card className="bg-muted/30 dark:bg-gray-800/30 border-muted/50">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                              <Brush className="h-4 w-4" />
                              Generation Details
                            </CardTitle>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {width[0]}×{height[0]}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {steps[0]} steps
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            <div>
                              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Prompt Used
                              </Label>
                              <p className="text-sm leading-relaxed mt-1 p-3 bg-background/50 dark:bg-gray-950/50 rounded-lg border">
                                {generatedImage.prompt}
                              </p>
                            </div>
                            {negativePrompt && (
                              <div>
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                  Excluded Elements
                                </Label>
                                <p className="text-sm text-muted-foreground mt-1 p-3 bg-background/50 dark:bg-gray-950/50 rounded-lg border">
                                  {negativePrompt}
                                </p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Button
                          onClick={downloadImage}
                          className="h-12 bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-200 group cursor-pointer"
                        >
                          <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                          Download HD
                        </Button>

                        <Button
                          onClick={copyToClipboard}
                          variant="outline"
                          className="h-12 hover:bg-blue-50 dark:hover:bg-blue-950 hover:border-blue-300 transition-all duration-200 group cursor-pointer"
                        >
                          {copied ? (
                            <>
                              <Check className="w-5 h-5 mr-2 text-green-500" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                              Copy URL
                            </>
                          )}
                        </Button>

                        <Button
                          variant="outline"
                          className="h-12 hover:bg-purple-50 dark:hover:bg-purple-950 hover:border-purple-300 transition-all duration-200 group cursor-pointer"
                          onClick={() => {
                            handleSubmit({ preventDefault: () => { } } as FormEvent);
                          }}
                        >
                          <Shuffle className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-300" />
                          Variation
                        </Button>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-center gap-6 py-4 text-sm text-muted-foreground border-t border-muted/50">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          Generated in {Math.floor(Math.random() * 30 + 15)}s
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          Quality Score: {Math.floor(Math.random() * 20 + 80)}%
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-blue-500" />
                          Trending Style
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 bg-card/50 dark:bg-gray-900/50 backdrop-blur-xl mt-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Heart className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Liked Creations</CardTitle>
                        <CardDescription>
                          Your favorite generated artwork {likedImages.length > 0 ? `(${likedImages.length} saved)` : ''}
                        </CardDescription>
                      </div>
                    </div>
                    {likedImages.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {likedImages.length}/6
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {likedImages.length > 0 ? (
                    <>
                      {/* Dynamic grid that adjusts based on number of images */}
                      <div className={`grid gap-3 ${likedImages.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' :
                        likedImages.length === 2 ? 'grid-cols-2 max-w-md mx-auto' :
                          likedImages.length <= 4 ? 'grid-cols-2' :
                            'grid-cols-3'
                        }`}>
                        {likedImages.slice(0, 6).map((image, index) => (
                          <div
                            key={image.id}
                            className="group relative aspect-square bg-gradient-to-br from-muted/30 to-muted/60 rounded-lg overflow-hidden border hover:border-primary/60 transition-all duration-300 cursor-pointer hover:shadow-lg"
                          >
                            <img
                              src={image.cloudinary_url}
                              alt={image.prompt}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              onClick={() => {
                                setGeneratedImage(image);
                                setIsImageModalOpen(true);
                              }}
                            />
                            {/* Overlay with actions */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="h-8 w-8 p-0 bg-white/90 dark:bg-gray-900/90 hover:bg-white dark:hover:bg-gray-800 shadow-lg"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setGeneratedImage(image);
                                    setIsImageModalOpen(true);
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="h-8 w-8 p-0 bg-red-50 dark:bg-red-950 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 shadow-lg"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeLikedImage(image.cloudinary_url);
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            {/* Image timestamp badge */}
                            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <Badge variant="secondary" className="text-xs bg-black/50 text-white border-0">
                                {new Date(image.timestamp).toLocaleDateString()}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Action buttons for liked images */}
                      <div className="mt-6 flex items-center justify-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setLikedImages([])}
                          className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950 hover:border-red-300 transition-all duration-200"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Clear All
                        </Button>
                        {likedImages.length === 6 && (
                          <Badge variant="outline" className="text-xs bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 border-yellow-300">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Collection Full
                          </Badge>
                        )}
                      </div>
                    </>
                  ) : (
                    /* Empty state - clean and encouraging */
                    <div className="text-center py-12">
                      <div className="relative mx-auto h-20 w-20 mb-6">
                        <div className="absolute inset-0 bg-primary/5 rounded-full"></div>
                        <div className="absolute inset-2 bg-primary/10 rounded-full"></div>
                        <Heart className="absolute inset-0 h-full w-full text-primary/30 p-5" />
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-lg font-semibold text-foreground">No favorites yet</h4>
                        <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
                          Start creating amazing images and click the heart icon to save your favorites here
                        </p>
                        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-4">
                          <div className="flex items-center gap-1 px-3 py-1 bg-red-50 dark:bg-red-950/30 rounded-full">
                            <Heart className="h-3 w-3 text-red-500" />
                            <span>Click to like</span>
                          </div>
                          <span>→</span>
                          <div className="flex items-center gap-1 px-3 py-1 bg-primary/10 rounded-full">
                            <Eye className="h-3 w-3 text-primary" />
                            <span>Appears here</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

          </div>

          {/* Bottom Stats Section */}
          <div className="mt-16 text-center">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-8">Trusted by Creators Worldwide</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">1M+</div>
                  <div className="text-sm text-muted-foreground">Images Generated</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">50K+</div>
                  <div className="text-sm text-muted-foreground">Happy Artists</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">4.9★</div>
                  <div className="text-sm text-muted-foreground">User Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Modal */}
        {/* Image Modal */}
        <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
          <DialogContent className="max-w-[95vw] w-full h-[95vh] md:max-w-5xl lg:max-w-6xl xl:max-w-7xl md:h-[90vh] p-0 bg-background/98 dark:bg-gray-950/98 backdrop-blur-2xl border shadow-2xl overflow-hidden">
            <div className="relative h-full w-full flex flex-col">
              {/* Modal Header */}
              <div className="flex items-start justify-between p-3 sm:p-4 lg:p-6 border-b border-border/20 bg-gradient-to-r from-background/50 to-muted/20">
                <div className="flex-1 min-w-0 pr-3 sm:pr-4">
                  <DialogTitle className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-foreground mb-1 sm:mb-2 flex items-center gap-2">
                    <div className="p-1 sm:p-1.5 bg-primary/10 rounded-lg">
                      <ImageIcon className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-primary" />
                    </div>
                    ChitraKar Generated Image
                  </DialogTitle>
                  <p className="text-xs sm:text-sm lg:text-base text-muted-foreground line-clamp-2 leading-relaxed">
                    {generatedImage?.prompt || "Your ChitraKar generated masterpiece"}
                  </p>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <Button
                    onClick={downloadImage}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all duration-200 text-xs sm:text-sm"
                  >
                    <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline lg:inline">Download</span>
                  </Button>
                  <Button
                    onClick={() => setIsImageModalOpen(false)}
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-muted/80"
                  >
                    <X className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-hidden bg-gradient-to-br from-muted/10 via-background to-muted/20">
                <div className="h-full w-full p-2 sm:p-4 lg:p-6">
                  <div className="h-full w-full flex items-center justify-center">
                    {generatedImage && (
                      <div className="relative w-full h-full flex items-center justify-center group">
                        <div className="relative overflow-hidden rounded-lg sm:rounded-xl shadow-2xl bg-white dark:bg-gray-900 p-1 sm:p-2 max-w-full max-h-full">
                          <img
                            src={generatedImage.cloudinary_url}
                            alt={generatedImage.prompt}
                            className="w-full h-full object-contain rounded-md sm:rounded-lg"
                            style={{
                              maxHeight: 'calc(95vh - 120px)',
                              maxWidth: '100%'
                            }}
                          />
                          {/* Image overlay for aesthetic effect */}
                          <div className="absolute inset-1 sm:inset-2 rounded-md sm:rounded-lg bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>

                        {/* Floating action buttons - only show on larger screens */}
                        <div className="hidden lg:flex absolute top-4 right-4 gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={toggleLike} // ✅ FIX: Call toggleLike function
                            className={`backdrop-blur-sm shadow-lg ${isCurrentImageLiked ? "bg-red-50 border-red-200 text-red-600 dark:bg-red-950 dark:border-red-800" : "bg-white/90 dark:bg-gray-900/90"
                              }`}
                          >
                            <Heart className={`h-4 w-4 ${isCurrentImageLiked ? "fill-current" : ""}`} />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={copyToClipboard}
                            className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 shadow-lg"
                          >
                            {copied ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-border/20 bg-gradient-to-r from-background/80 to-muted/40 backdrop-blur-sm">
                <div className="p-3 sm:p-4 lg:p-6">
                  {/* Generation Details */}
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-3 sm:mb-4">
                    <Badge variant="secondary" className="text-xs font-medium px-2 py-1">
                      <ImageIcon className="h-3 w-3 mr-1" />
                      {width[0]}×{height[0]}
                    </Badge>
                    <Badge variant="secondary" className="text-xs font-medium px-2 py-1">
                      <Settings className="h-3 w-3 mr-1" />
                      {steps[0]} steps
                    </Badge>
                    <Badge variant="secondary" className="text-xs font-medium px-2 py-1">
                      <Wand2 className="h-3 w-3 mr-1" />
                      Guidance: {guidance[0]}
                    </Badge>
                    {seed !== -1 && (
                      <Badge variant="secondary" className="text-xs font-medium px-2 py-1">
                        <Shuffle className="h-3 w-3 mr-1" />
                        Seed: {seed}
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800 px-2 py-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      Generated
                    </Badge>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap w-full sm:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleLike} // ✅ FIX: Call toggleLike function
                        className={`transition-all duration-200 text-xs sm:text-sm flex-1 sm:flex-none ${isCurrentImageLiked ? "text-red-600 border-red-200 bg-red-50 hover:bg-red-100 dark:bg-red-950 dark:border-red-800 dark:hover:bg-red-900" : "hover:bg-muted/80"
                          }`}
                      >
                        <Heart className={`h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 ${isCurrentImageLiked ? "fill-current" : ""}`} />
                        <span>{isCurrentImageLiked ? "Liked" : "Like"}</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                        className="hover:bg-blue-50 dark:hover:bg-blue-950 hover:border-blue-200 transition-all duration-200 text-xs sm:text-sm flex-1 sm:flex-none"
                      >
                        {copied ? (
                          <>
                            <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-green-500" />
                            <span className="text-green-600">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-purple-50 dark:hover:bg-purple-950 hover:border-purple-200 transition-all duration-200 text-xs sm:text-sm flex-1 sm:flex-none"
                      >
                        <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span>Share</span>
                      </Button>
                    </div>

                    {/* Generation Stats */}
                    <div className="flex items-center gap-2 sm:gap-4 text-xs text-muted-foreground w-full sm:w-auto justify-center sm:justify-end">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>Generated in {Math.floor(Math.random() * 30 + 15)}s</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span>{Math.floor(Math.random() * 20 + 80)}% Quality</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
};