'use client'

import { Label } from '@/presentation/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/presentation/components/ui/select'
import { Button } from '@/presentation/components/ui/button'
import { X } from 'lucide-react'

interface JewelryFiltersProps {
  filters: {
    jewelryMaterial?: string
    jewelryPurity?: string
    jewelryType?: string
    jewelryGender?: string
    stoneType?: string
  }
  onFilterChange: (key: string, value: string | undefined) => void
  onClearFilters: () => void
}

export function JewelryFilters({ filters, onFilterChange, onClearFilters }: JewelryFiltersProps) {
  const hasActiveFilters = Object.values(filters).some(v => v !== undefined && v !== '')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Jewelry Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Material Filter */}
        <div className="space-y-2">
          <Label htmlFor="filter-material">Material</Label>
          <Select
            value={filters.jewelryMaterial || ''}
            onValueChange={(value) => onFilterChange('jewelryMaterial', value || undefined)}
          >
            <SelectTrigger id="filter-material">
              <SelectValue placeholder="All materials" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All materials</SelectItem>
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

        {/* Purity Filter */}
        <div className="space-y-2">
          <Label htmlFor="filter-purity">Purity</Label>
          <Select
            value={filters.jewelryPurity || ''}
            onValueChange={(value) => onFilterChange('jewelryPurity', value || undefined)}
          >
            <SelectTrigger id="filter-purity">
              <SelectValue placeholder="All purities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All purities</SelectItem>
              <SelectItem value="24k">24K</SelectItem>
              <SelectItem value="22k">22K</SelectItem>
              <SelectItem value="18k">18K</SelectItem>
              <SelectItem value="14k">14K</SelectItem>
              <SelectItem value="10k">10K</SelectItem>
              <SelectItem value="925-sterling">925 Sterling</SelectItem>
              <SelectItem value="999-fine">999 Fine</SelectItem>
              <SelectItem value="958-britannia">958 Britannia</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Type Filter */}
        <div className="space-y-2">
          <Label htmlFor="filter-type">Type</Label>
          <Select
            value={filters.jewelryType || ''}
            onValueChange={(value) => onFilterChange('jewelryType', value || undefined)}
          >
            <SelectTrigger id="filter-type">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All types</SelectItem>
              <SelectItem value="ring">Ring</SelectItem>
              <SelectItem value="necklace">Necklace</SelectItem>
              <SelectItem value="bracelet">Bracelet</SelectItem>
              <SelectItem value="earrings">Earrings</SelectItem>
              <SelectItem value="pendant">Pendant</SelectItem>
              <SelectItem value="chain">Chain</SelectItem>
              <SelectItem value="bangle">Bangle</SelectItem>
              <SelectItem value="anklet">Anklet</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Gender Filter */}
        <div className="space-y-2">
          <Label htmlFor="filter-gender">Gender</Label>
          <Select
            value={filters.jewelryGender || ''}
            onValueChange={(value) => onFilterChange('jewelryGender', value || undefined)}
          >
            <SelectTrigger id="filter-gender">
              <SelectValue placeholder="All genders" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All genders</SelectItem>
              <SelectItem value="men">Men</SelectItem>
              <SelectItem value="women">Women</SelectItem>
              <SelectItem value="unisex">Unisex</SelectItem>
              <SelectItem value="kids">Kids</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stone Filter */}
        <div className="space-y-2">
          <Label htmlFor="filter-stone">Stone</Label>
          <Select
            value={filters.stoneType || ''}
            onValueChange={(value) => onFilterChange('stoneType', value || undefined)}
          >
            <SelectTrigger id="filter-stone">
              <SelectValue placeholder="All stones" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All stones</SelectItem>
              <SelectItem value="none">No Stone</SelectItem>
              <SelectItem value="diamond">Diamond</SelectItem>
              <SelectItem value="ruby">Ruby</SelectItem>
              <SelectItem value="sapphire">Sapphire</SelectItem>
              <SelectItem value="emerald">Emerald</SelectItem>
              <SelectItem value="pearl">Pearl</SelectItem>
              <SelectItem value="amethyst">Amethyst</SelectItem>
              <SelectItem value="topaz">Topaz</SelectItem>
              <SelectItem value="garnet">Garnet</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

