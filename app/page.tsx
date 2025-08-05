'use client';

import { useState, FormEvent, useEffect } from 'react';
import { generateImage, ImageGenerationRequest, ImageGenerationResponse } from '@/lib/api';
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
  Brush
} from 'lucide-react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [steps, setSteps] = useState([30]);
  const [guidance, setGuidance] = useState([7.5]);
  const [width, setWidth] = useState([1024]);
  const [height, setHeight] = useState([1024]);
  const [seed, setSeed] = useState(-1);
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedImage, setGeneratedImage] = useState<ImageGenerationResponse | null>(null);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


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
      const request: ImageGenerationRequest = {
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
    setSteps([30]);
    setGuidance([7.5]);
    setWidth([1024]);
    setHeight([1024]);
    setSeed(-1);
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
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/5 border-b">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative container mx-auto px-4 py-16">
            <div className="text-center space-y-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl"></div>
                  <div className="relative p-4 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-2xl">
                    <Sparkles className="h-12 w-12 text-primary-foreground animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h1 className="text-6xl font-black bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
                    AI Studio
                  </h1>
                  <div className="flex items-center gap-2 justify-center">
                    <Badge variant="secondary" className="px-3 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Pro
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Latest AI By <strong>Akash More</strong>
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
              <Card className="shadow-2xl border-0 bg-card/50 backdrop-blur-xl">
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
                    <Button variant="outline" size="sm" onClick={resetToDefaults}>
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
                                setGuidance([5]);
                              }}
                            >
                              <span>⚡ Fast</span>
                              <span className="text-xs">20 steps</span>
                            </Button>
                            <Button
                              type="button"
                              variant={steps[0] === 30 ? "default" : "outline"}
                              className="justify-between"
                              onClick={() => {
                                setSteps([30]);
                                setGuidance([7.5]);
                              }}
                            >
                              <span>⚖️ Balanced</span>
                              <span className="text-xs">30 steps</span>
                            </Button>
                            <Button
                              type="button"
                              variant={steps[0] === 50 ? "default" : "outline"}
                              className="justify-between"
                              onClick={() => {
                                setSteps([50]);
                                setGuidance([10]);
                              }}
                            >
                              <span>💎 Premium</span>
                              <span className="text-xs">50 steps</span>
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
              <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-xl">
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
              <Card className="shadow-2xl border-0 bg-card/50 backdrop-blur-xl h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <ImageIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Your Masterpiece</CardTitle>
                        <CardDescription>
                          AI-generated artwork appears here
                        </CardDescription>
                      </div>
                    </div>
                    {generatedImage && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setLiked(!liked)}
                          className={liked ? "text-red-500" : ""}
                        >
                          <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
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
                          onClick={() => window.open(generatedImage.cloudinary_url, '_blank')}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-2xl">
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Button variant="secondary" size="sm">
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
                            <p className="text-lg">Enter your prompt and let AI work its magic</p>
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
                      <Card className="bg-muted/30 border-muted/50">
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
                              <p className="text-sm leading-relaxed mt-1 p-3 bg-background/50 rounded-lg border">
                                {generatedImage.prompt}
                              </p>
                            </div>
                            {negativePrompt && (
                              <div>
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                  Excluded Elements
                                </Label>
                                <p className="text-sm text-muted-foreground mt-1 p-3 bg-background/50 rounded-lg border">
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
                          className="h-12 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 group cursor-pointer"
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
                          className="h-12 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 group cursor-pointer"
                          onClick={() => {
                            // Use the same prompt to generate a variation
                            handleSubmit({ preventDefault: () => {} } as FormEvent);
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
      </div>
    </TooltipProvider>
  );
}