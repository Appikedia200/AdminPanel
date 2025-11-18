'use client'

import { Dispatch, SetStateAction } from 'react'
import { Label } from '@/presentation/components/ui/label'
import { Input } from '@/presentation/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/presentation/components/ui/select'
import { Checkbox } from '@/presentation/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import type { 
  JewelryDetails,
  JewelryMaterial,
  JewelryPurity,
  JewelryType,
  JewelryGender,
  StoneType,
  StoneClarity,
  StoneColor,
  StoneCut,
  MetalWeightUnit,
  SizeType,
  SizeUnit
} from '@/shared/types/entity.types'

interface JewelryFieldsProps {
  jewelry: Partial<JewelryDetails>
  setJewelry: Dispatch<SetStateAction<Partial<JewelryDetails>>>
  isJewelryCategory: boolean
}

export function JewelryFields({ jewelry, setJewelry, isJewelryCategory }: JewelryFieldsProps) {
  if (!isJewelryCategory) return null

  const handleChange = (field: string, value: string | number | boolean) => {
    const keys = field.split('.')
    if (keys.length === 1) {
      setJewelry(prev => ({ ...prev, [keys[0]]: value }))
    } else if (keys.length === 2) {
      setJewelry(prev => ({
        ...prev,
        [keys[0]]: {
          ...(prev[keys[0] as keyof JewelryDetails] as Record<string, unknown> || {}),
          [keys[1]]: value
        }
      }))
    }
  }

  const certificationAvailable = jewelry.certification?.available || false
  const stoneType = jewelry.stone?.type

  return (
    <Card>
      <CardHeader>
        <CardTitle>Jewelry Details</CardTitle>
        <CardDescription>
          Specify jewelry-specific attributes. Material and Type are required for jewelry products.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Material & Purity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="jewelry-material">
              Material <span className="text-destructive">*</span>
            </Label>
            <Select
              value={jewelry.material || ''}
              onValueChange={(value) => handleChange('material', value as JewelryMaterial)}
            >
              <SelectTrigger id="jewelry-material">
                <SelectValue placeholder="Select material" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="platinum">Platinum</SelectItem>
                <SelectItem value="white-gold">White Gold</SelectItem>
                <SelectItem value="rose-gold">Rose Gold</SelectItem>
                <SelectItem value="titanium">Titanium</SelectItem>
                <SelectItem value="stainless-steel">Stainless Steel</SelectItem>
                <SelectItem value="brass">Brass</SelectItem>
                <SelectItem value="copper">Copper</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jewelry-purity">Purity</Label>
            <Select
              value={jewelry.purity || ''}
              onValueChange={(value) => handleChange('purity', value as JewelryPurity)}
            >
              <SelectTrigger id="jewelry-purity">
                <SelectValue placeholder="Select purity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24k">24K</SelectItem>
                <SelectItem value="22k">22K</SelectItem>
                <SelectItem value="18k">18K</SelectItem>
                <SelectItem value="14k">14K</SelectItem>
                <SelectItem value="10k">10K</SelectItem>
                <SelectItem value="925-sterling">925 Sterling</SelectItem>
                <SelectItem value="999-fine">999 Fine</SelectItem>
                <SelectItem value="958-britannia">958 Britannia</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Jewelry Type & Gender */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="jewelry-type">
              Jewelry Type <span className="text-destructive">*</span>
            </Label>
            <Select
              value={jewelry.type || ''}
              onValueChange={(value) => handleChange('type', value as JewelryType)}
            >
              <SelectTrigger id="jewelry-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ring">Ring</SelectItem>
                <SelectItem value="necklace">Necklace</SelectItem>
                <SelectItem value="bracelet">Bracelet</SelectItem>
                <SelectItem value="earrings">Earrings</SelectItem>
                <SelectItem value="pendant">Pendant</SelectItem>
                <SelectItem value="chain">Chain</SelectItem>
                <SelectItem value="bangle">Bangle</SelectItem>
                <SelectItem value="anklet">Anklet</SelectItem>
                <SelectItem value="brooch">Brooch</SelectItem>
                <SelectItem value="cufflinks">Cufflinks</SelectItem>
                <SelectItem value="nose-ring">Nose Ring</SelectItem>
                <SelectItem value="toe-ring">Toe Ring</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jewelry-gender">Gender</Label>
            <Select
              value={jewelry.gender || ''}
              onValueChange={(value) => handleChange('gender', value as JewelryGender)}
            >
              <SelectTrigger id="jewelry-gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="men">Men</SelectItem>
                <SelectItem value="women">Women</SelectItem>
                <SelectItem value="unisex">Unisex</SelectItem>
                <SelectItem value="kids">Kids</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Metal Weight */}
        <div className="space-y-2">
          <Label>Metal Weight</Label>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              step="0.01"
              placeholder="Weight value"
              value={jewelry.metalWeight?.value || ''}
              onChange={(e) => handleChange('metalWeight.value', parseFloat(e.target.value) || 0)}
            />
            <Select
              value={jewelry.metalWeight?.unit || 'grams'}
              onValueChange={(value) => handleChange('metalWeight.unit', value as MetalWeightUnit)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grams">Grams</SelectItem>
                <SelectItem value="ounces">Ounces</SelectItem>
                <SelectItem value="carats">Carats</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stone Details */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="stone-type">Stone Type</Label>
            <Select
              value={jewelry.stone?.type || 'none'}
              onValueChange={(value) => {
                setJewelry(prev => ({
                  ...prev,
                  stone: {
                    ...prev.stone,
                    type: value as StoneType
                  }
                }))
              }}
            >
              <SelectTrigger id="stone-type">
                <SelectValue placeholder="Select stone type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="diamond">Diamond</SelectItem>
                <SelectItem value="ruby">Ruby</SelectItem>
                <SelectItem value="sapphire">Sapphire</SelectItem>
                <SelectItem value="emerald">Emerald</SelectItem>
                <SelectItem value="pearl">Pearl</SelectItem>
                <SelectItem value="amethyst">Amethyst</SelectItem>
                <SelectItem value="topaz">Topaz</SelectItem>
                <SelectItem value="garnet">Garnet</SelectItem>
                <SelectItem value="opal">Opal</SelectItem>
                <SelectItem value="turquoise">Turquoise</SelectItem>
                <SelectItem value="cubic-zirconia">Cubic Zirconia</SelectItem>
                <SelectItem value="moissanite">Moissanite</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {stoneType && stoneType !== 'none' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-2 border-primary/20">
              <div className="space-y-2">
                <Label htmlFor="carat-weight">Carat Weight</Label>
                <Input
                  id="carat-weight"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={jewelry.stone?.caratWeight || ''}
                  onChange={(e) => {
                    setJewelry(prev => ({
                      ...prev,
                      stone: {
                        ...prev.stone,
                        type: prev.stone?.type || 'none',
                        caratWeight: parseFloat(e.target.value) || undefined
                      }
                    }))
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stone-clarity">Clarity</Label>
                <Select
                  value={jewelry.stone?.clarity || ''}
                  onValueChange={(value) => {
                    setJewelry(prev => ({
                      ...prev,
                      stone: {
                        ...prev.stone,
                        type: prev.stone?.type || 'none',
                        clarity: value as StoneClarity
                      }
                    }))
                  }}
                >
                  <SelectTrigger id="stone-clarity">
                    <SelectValue placeholder="Select clarity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FL">FL - Flawless</SelectItem>
                    <SelectItem value="IF">IF - Internally Flawless</SelectItem>
                    <SelectItem value="VVS1">VVS1</SelectItem>
                    <SelectItem value="VVS2">VVS2</SelectItem>
                    <SelectItem value="VS1">VS1</SelectItem>
                    <SelectItem value="VS2">VS2</SelectItem>
                    <SelectItem value="SI1">SI1</SelectItem>
                    <SelectItem value="SI2">SI2</SelectItem>
                    <SelectItem value="I1">I1</SelectItem>
                    <SelectItem value="I2">I2</SelectItem>
                    <SelectItem value="I3">I3</SelectItem>
                    <SelectItem value="N/A">N/A</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stone-color">Color Grade</Label>
                <Select
                  value={jewelry.stone?.color || ''}
                  onValueChange={(value) => {
                    setJewelry(prev => ({
                      ...prev,
                      stone: {
                        ...prev.stone,
                        type: prev.stone?.type || 'none',
                        color: value as StoneColor
                      }
                    }))
                  }}
                >
                  <SelectTrigger id="stone-color">
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="D">D - Colorless</SelectItem>
                    <SelectItem value="E">E</SelectItem>
                    <SelectItem value="F">F</SelectItem>
                    <SelectItem value="G">G - Near Colorless</SelectItem>
                    <SelectItem value="H">H</SelectItem>
                    <SelectItem value="I">I</SelectItem>
                    <SelectItem value="J">J</SelectItem>
                    <SelectItem value="K">K - Faint</SelectItem>
                    <SelectItem value="L">L</SelectItem>
                    <SelectItem value="M">M</SelectItem>
                    <SelectItem value="N">N</SelectItem>
                    <SelectItem value="fancy">Fancy Color</SelectItem>
                    <SelectItem value="N/A">N/A</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stone-cut">Cut Quality</Label>
                <Select
                  value={jewelry.stone?.cut || ''}
                  onValueChange={(value) => {
                    setJewelry(prev => ({
                      ...prev,
                      stone: {
                        ...prev.stone,
                        type: prev.stone?.type || 'none',
                        cut: value as StoneCut
                      }
                    }))
                  }}
                >
                  <SelectTrigger id="stone-cut">
                    <SelectValue placeholder="Select cut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="very-good">Very Good</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                    <SelectItem value="N/A">N/A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* Size */}
        <div className="space-y-2">
          <Label>Size</Label>
          <div className="grid grid-cols-3 gap-4">
            <Select
              value={jewelry.size?.type || ''}
              onValueChange={(value) => {
                setJewelry(prev => ({
                  ...prev,
                  size: {
                    ...prev.size,
                    type: value as SizeType,
                    value: prev.size?.value || '',
                    unit: prev.size?.unit || 'US'
                  }
                }))
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Size type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ring-size">Ring Size</SelectItem>
                <SelectItem value="length">Length</SelectItem>
                <SelectItem value="diameter">Diameter</SelectItem>
                <SelectItem value="adjustable">Adjustable</SelectItem>
                <SelectItem value="one-size">One Size</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Value"
              value={jewelry.size?.value || ''}
              onChange={(e) => {
                setJewelry(prev => ({
                  ...prev,
                  size: {
                    type: prev.size?.type || 'ring-size',
                    value: e.target.value,
                    unit: prev.size?.unit || 'US'
                  }
                }))
              }}
            />

            <Select
              value={jewelry.size?.unit || 'US'}
              onValueChange={(value) => {
                setJewelry(prev => ({
                  ...prev,
                  size: {
                    type: prev.size?.type || 'ring-size',
                    value: prev.size?.value || '',
                    unit: value as SizeUnit
                  }
                }))
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="US">US</SelectItem>
                <SelectItem value="UK">UK</SelectItem>
                <SelectItem value="EU">EU</SelectItem>
                <SelectItem value="mm">mm</SelectItem>
                <SelectItem value="cm">cm</SelectItem>
                <SelectItem value="inches">inches</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Certification */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="certification-available"
              checked={certificationAvailable}
              onCheckedChange={(checked) => {
                setJewelry(prev => ({
                  ...prev,
                  certification: {
                    ...prev.certification,
                    available: checked as boolean
                  }
                }))
              }}
            />
            <Label htmlFor="certification-available" className="cursor-pointer">
              This jewelry is certified
            </Label>
          </div>

          {certificationAvailable && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-2 border-primary/20">
              <div className="space-y-2">
                <Label htmlFor="cert-issued-by">Issued By</Label>
                <Input
                  id="cert-issued-by"
                  placeholder="e.g., GIA, AGS, IGI"
                  value={jewelry.certification?.issuedBy || ''}
                  onChange={(e) => {
                    setJewelry(prev => ({
                      ...prev,
                      certification: {
                        available: true,
                        issuedBy: e.target.value,
                        certificateNumber: prev.certification?.certificateNumber
                      }
                    }))
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cert-number">Certificate Number</Label>
                <Input
                  id="cert-number"
                  placeholder="Certificate number"
                  value={jewelry.certification?.certificateNumber || ''}
                  onChange={(e) => {
                    setJewelry(prev => ({
                      ...prev,
                      certification: {
                        available: true,
                        issuedBy: prev.certification?.issuedBy,
                        certificateNumber: e.target.value
                      }
                    }))
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

