import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Minus, Rocket, ArrowLeft } from "lucide-react"
import { UploadDropzone } from "@/components/ui/upload-dropzone"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { MessageCircle, Twitter } from "lucide-react"

interface TwitterConfig {
  username: string
  email: string
  password: string
}

interface TelegramConfig {
  bot_secret: string
}

interface Person {
  name: string
  platforms: string[]
}

interface AgentSettings {
  name: string
  ticker: string
  bio: string
  knowledge: string[]
  people: Person[]
  style: string[]
  enabledPlatforms: string[]
  twitterConfig: TwitterConfig
  telegramConfig: TelegramConfig
  twitterStyles: string[]
  telegramStyles: string[]
  buyAmount: string
}

function LaunchPage() {
  const [settings, setSettings] = useState<AgentSettings>({
    name: '',
    ticker: '',
    bio: '',
    knowledge: [''],
    people: [{ name: '', platforms: [] }],
    style: [''],
    enabledPlatforms: [],
    twitterConfig: {
      username: '',
      email: '',
      password: ''
    },
    telegramConfig: {
      bot_secret: ''
    },
    twitterStyles: [''],
    telegramStyles: [''],
    buyAmount: '0.15'
  })
  
  const submitAgent = async () => {
    console.log("Submit Agent");
    const { name, ticker, bio, knowledge, people, style, enabledPlatforms, twitterConfig, telegramConfig, twitterStyles, telegramStyles, buyAmount } = settings
    const formData = new FormData();
    formData.append("name", name)
    formData.append("ticker", ticker)
    formData.append("bio", bio)
    knowledge.forEach((input, index) => {
      formData.append(`knowledge[${index}]`, input)
    })
    people.forEach((person, index) => {
      formData.append(`people[${index}]`, JSON.stringify(person))
    })
    style.forEach((input, index) => {
      formData.append(`style[${index}]`, input)
    })
    enabledPlatforms.forEach((platform, index) => {
      formData.append(`enabled_platforms[${index}]`, platform)
    })
    formData.append("twitter_config", JSON.stringify(twitterConfig))
    formData.append("telegram_config", JSON.stringify(telegramConfig))
    twitterStyles.forEach((input, index) => {
      formData.append(`twitter_styles[${index}]`, input)
    })
    telegramStyles.forEach((input, index) => {
      formData.append(`telegram_styles[${index}]`, input)
    })
    formData.append("buy_amount", buyAmount.toString())

    const response = await fetch("/api/agent/launch", {
      method: "POST",
      body: formData
    })

    const data = await response.json();
    console.log(data);
  }

  const updateSetting = <K extends keyof AgentSettings>(
    field: K, 
    value: AgentSettings[K]
  ) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const updateArrayField = (
    field: keyof Pick<AgentSettings, 'knowledge' | 'style' | 'twitterStyles' | 'telegramStyles'>,
    index: number,
    value: string
  ) => {
    setSettings(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const addArrayItem = (
    field: keyof Pick<AgentSettings, 'knowledge' | 'style' | 'twitterStyles' | 'telegramStyles'>
  ) => {
    setSettings(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const removeArrayItem = (
    field: keyof Pick<AgentSettings, 'knowledge' | 'style' | 'twitterStyles' | 'telegramStyles'>,
    index: number
  ) => {
    setSettings(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const handlePeopleInputChange = (
    index: number,
    value: string | string[],
    field: keyof Person
  ) => {
    setSettings(prev => ({
      ...prev,
      people: prev.people.map((person, i) =>
        i === index ? { ...person, [field]: value } : person
      )
    }))
  }

  const addPerson = () => {
    setSettings(prev => ({
      ...prev,
      people: [...prev.people, { name: '', platforms: [] }]
    }))
  }

  const removePerson = (index: number) => {
    setSettings(prev => ({
      ...prev,
      people: prev.people.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 md:top-8 md:left-8"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <h1 className="text-3xl font-bold text-center">Launch Agent</h1>
        
        <div className="space-y-8">
          {/* Single Card for All Inputs */}
          <Card className="p-6 border">
            <CardHeader>
              <CardTitle>Launch Agent</CardTitle>
              <CardDescription>Configure your agent's settings and platforms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Image and Basic Info Section */}
              <div className="flex flex-col md:flex-row gap-8 h-[300px]">
                {/* Left Column - Image Upload */}
                <div className="w-full md:w-64">
                  <div className="h-full flex flex-col">
                    <Label className="mb-3">Agent Image</Label>
                    <div className="flex-1 border-2 border-dashed rounded-lg p-4 hover:border-primary/50 transition-colors">
                      <UploadDropzone 
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          console.log("Files: ", res)
                        }}
                        onUploadError={(error: Error) => {
                          console.error("Error: ", error)
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column - Basic Info */}
                <div className="flex-1">
                  <div className="h-full flex flex-col">
                    <div className="space-y-3 mb-4">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={settings.name}
                            onChange={(e) => updateSetting('name', e.target.value)}
                            placeholder="CubieCubed"
                          />
                        </div>
                        <div className="w-32">
                          <Label htmlFor="ticker">Ticker</Label>
                          <Input
                            id="ticker"
                            value={settings.ticker}
                            onChange={(e) => updateSetting('ticker', e.target.value)}
                            placeholder="CUBIE"
                            className="font-mono uppercase"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col space-y-3">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio"
                        value={settings.bio}
                        onChange={(e) => updateSetting('bio', e.target.value)}
                        placeholder="First social agent built using $MAIAR"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-8" />

              {/* Knowledge and People Section */}
              <div className="grid grid-cols-2 gap-4">
                {/* Knowledge Column */}
                <div className="space-y-3">
                  <Label>Knowledge</Label>
                  {settings.knowledge.map((input, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={input}
                        onChange={(e) => updateArrayField('knowledge', index, e.target.value)}
                        placeholder={`Knowledge ${index + 1}`}
                      />
                      {index === settings.knowledge.length - 1 && settings.knowledge.length < 10 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => addArrayItem('knowledge')}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      )}
                      {settings.knowledge.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeArrayItem('knowledge', index)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {/* People Column */}
                <div className="space-y-3">
                  <Label>People</Label>
                  {settings.people.map((input, index) => (
                    <div key={index} className="flex gap-4 items-center">
                      <ToggleGroup
                        type="multiple"
                        value={input.platforms}
                        onValueChange={(value) => handlePeopleInputChange(index, value, 'platforms')}
                        className="flex"
                        variant="outline"
                      >
                        <ToggleGroupItem value="twitter" size="sm" >
                          <Twitter className="h-4 w-4" />
                        </ToggleGroupItem>
                        <ToggleGroupItem value="telegram" size="sm" >
                          <MessageCircle className="h-4 w-4" />
                        </ToggleGroupItem>
                      </ToggleGroup>
                      
                      <div className="flex gap-2 flex-1">
                        <Input
                          value={input.name}
                          onChange={(e) => handlePeopleInputChange(index, e.target.value, 'name')}
                          placeholder={`Person ${index + 1}`}
                        />
                        {index === settings.people.length - 1 && settings.people.length < 10 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={addPerson}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        )}
                        {settings.people.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removePerson(index)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-8" />

              {/* Style & Platform Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Style & Platform Configuration</h3>
                <div className="space-y-4">
                  <Label>Shared Style Rules</Label>
                  {settings.style.map((input, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={input}
                        onChange={(e) => updateArrayField('style', index, e.target.value)}
                        placeholder="Style rules that apply to all platforms"
                      />
                      {index === settings.style.length - 1 && settings.style.length < 10 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => addArrayItem('style')}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      )}
                      {settings.style.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeArrayItem('style', index)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <ToggleGroup
                  type="multiple"
                  variant='outline'
                  value={settings.enabledPlatforms}
                  onValueChange={(value) => updateSetting('enabledPlatforms', value)}
                  className="grid grid-cols-2 w-full"
                >
                  <ToggleGroupItem value="twitter" className="">Twitter</ToggleGroupItem>
                  <ToggleGroupItem value="telegram" className="">Telegram</ToggleGroupItem>
                </ToggleGroup>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    {settings.enabledPlatforms.includes('twitter') && (
                      <div className="space-y-4">
                        <Label>Twitter Configuration</Label>
                        <div className="space-y-2">
                          <Input
                            placeholder="Username"
                            value={settings.twitterConfig.username}
                            onChange={(e) => updateSetting('twitterConfig', {
                              ...settings.twitterConfig,
                              username: e.target.value
                            })}
                          />
                          <Input
                            placeholder="Email"
                            type="email"
                            value={settings.twitterConfig.email}
                            onChange={(e) => updateSetting('twitterConfig', {
                              ...settings.twitterConfig,
                              email: e.target.value
                            })}
                          />
                          <Input
                            placeholder="Password"
                            type="password"
                            value={settings.twitterConfig.password}
                            onChange={(e) => updateSetting('twitterConfig', {
                              ...settings.twitterConfig,
                              password: e.target.value
                            })}
                          />
                        </div>

                        <div className="space-y-3">
                          <Label>Twitter Style Rules</Label>
                          {settings.twitterStyles.map((input, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                value={input}
                                onChange={(e) => updateArrayField('twitterStyles', index, e.target.value)}
                                placeholder="e.g., Use emojis sparingly"
                              />
                              {index === settings.twitterStyles.length - 1 && settings.twitterStyles.length < 10 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => addArrayItem('twitterStyles')}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              )}
                              {settings.twitterStyles.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => removeArrayItem('twitterStyles', index)}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    {settings.enabledPlatforms.includes('telegram') && (
                      <div className="space-y-4">
                        <Label>Telegram Configuration</Label>
                        <div className="space-y-2">
                          <Input
                            placeholder="Bot Secret"
                            value={settings.telegramConfig.bot_secret}
                            onChange={(e) => updateSetting('telegramConfig', {
                              ...settings.telegramConfig,
                              bot_secret: e.target.value
                            })}
                          />
                        </div>

                        <div className="space-y-3">
                          <Label>Telegram Style Rules</Label>
                          {settings.telegramStyles.map((input, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                value={input}
                                onChange={(e) => updateArrayField('telegramStyles', index, e.target.value)}
                                placeholder="e.g., Use markdown formatting"
                              />
                              {index === settings.telegramStyles.length - 1 && settings.telegramStyles.length < 10 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => addArrayItem('telegramStyles')}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              )}
                              {settings.telegramStyles.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => removeArrayItem('telegramStyles', index)}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t pt-8" />

              {/* Buy Amount Section */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Buy Amount</h3>
                  <p className="text-sm text-muted-foreground">Enter the amount of SOL you want to spend</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buyAmount">Buy</Label>
                  <Input
                    id="buyAmount"
                    value={settings.buyAmount}
                    onChange={(e) => updateSetting('buyAmount', e.target.value)}
                    placeholder="0.15"
                    type="number"
                    step="0.01"
                    min="0"
                    className="max-w-[200px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Launch Button */}
          <div className="flex justify-center">
            <Button 
              size="lg"
              className={cn(
                "bg-[#00ff9d] hover:bg-[#00ff9d]/90 text-black font-semibold",
                "px-8 py-6 text-lg shadow-lg",
                "flex items-center gap-2"
              )}
              onClick={submitAgent}
            >
              <Rocket className="h-5 w-5" />
              Launch
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LaunchPage 