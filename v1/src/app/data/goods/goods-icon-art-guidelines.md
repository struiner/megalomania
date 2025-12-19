# Goods Icon Art Guidelines & Naming Conventions

## Overview

This document provides comprehensive guidelines for creating and managing goods icons in the Megalomania project. It covers art style constraints, naming conventions, technical specifications, and workflow processes to ensure visual consistency across all goods icons.

## Art Style Foundation: Retro-Hanseatic Theme

### Core Aesthetic Principles

Our goods icons follow a **retro-Hanseatic** art style that combines:

- **Medieval/Renaissance aesthetics** with modern pixel art sensibilities
- **Han League merchant culture** influences (trade-focused, guild-oriented)
- **Practical, functional design** that prioritizes recognition over decoration
- **Limited color palettes** that enhance readability at small sizes
- **Clean, deterministic shapes** that scale well across different resolutions

### Visual Style Guidelines

#### 1. **Retro Pixel Aesthetic**
- **Resolution**: 64x32 pixels (primary), 128x64 pixels (hi-res variant)
- **Pixel density**: Maintain crisp, clean pixels without anti-aliasing
- **Grid alignment**: All elements must align to the pixel grid
- **Line weight**: Consistent 2px strokes for primary elements

#### 2. **Color Palette Principles**
- **Base colors**: Earth tones (browns, grays, ochres) for historical authenticity
- **Accent colors**: Limited use of bright colors for category distinction
- **Contrast ratios**: Ensure accessibility with sufficient contrast
- **Consistency**: Similar goods should use related color families

#### 3. **Shape and Form**
- **Silhouette-first design**: Icons must be recognizable as silhouettes
- **Simplified forms**: Reduce complex details to essential shapes
- **Functional representation**: Show what the good *does* rather than what it *is*
- **Category consistency**: Related goods should share visual elements

#### 4. **Cultural Context**
- **Hanseatic trade theme**: Emphasize commerce, craftsmanship, and quality
- **Medieval craftsmanship**: Show goods as they would appear in trade contexts
- **Guild aesthetic**: Professional, high-quality appearance
- **Practical design**: Avoid ornate decoration in favor of clarity

## Technical Specifications

### File Structure and Naming

#### Directory Organization
```
/assets/goods/
├── goods_{goodstype}_{era}@64-32.png    (Primary resolution)
├── goods_{goodstype}_{era}@128.png      (Hi-res variant)
└── placeholders/
    └── placeholder_{era}.png             (Generic placeholders)
```

#### Naming Convention
```
Format: goods_{goodstype}_{era}@{resolution}

Examples:
- goods_wood_marble@64-32.png
- goods_iron_ironbound@64-32.png  
- goods_electronics_modern@64-32.png
- goods_aetherium_ethereal@128.png
```

#### Resolution Standards
- **@64-32**: Primary resolution for most UI contexts
- **@128**: Hi-res variant for detailed views or large displays
- **Consistency**: Both resolutions must show the same design
- **Scaling**: 128px version should be exactly 2x the 64px version

### Technical Requirements

#### Image Specifications
- **Format**: PNG with transparency
- **Color depth**: 32-bit RGBA
- **Compression**: Optimize for web delivery
- **Metadata**: Include creation date and artist attribution

#### Grid and Layout
- **Canvas size**: Exactly 64x32 or 128x64 pixels
- **Safe area**: Use full canvas, no padding required
- **Element positioning**: Align to pixel grid (no sub-pixel positioning)
- **Stroke alignment**: Strokes should align to grid lines

#### Performance Considerations
- **File size**: Keep under 5KB for 64-32, under 20KB for 128 variants
- **Optimization**: Use appropriate compression levels
- **Delivery**: Consider sprite sheets for batch delivery

## Era-Based Visual Evolution

### Era Classification System

Icons evolve visually across different historical periods, allowing goods to appear contextually appropriate:

#### **Classical Era (Marble, Golden, Sandstone)**
- **Aesthetic**: Clean, proportional, architectural
- **Materials**: Stone, bronze, marble, fine woods
- **Colors**: Earth tones with gold accents
- **Examples**: Wood, Grain, Cloth, Pottery, Wine

#### **Industrial Era (Ironbound, Smokeforged, Mechanized)**
- **Aesthetic**: Mechanical, functional, robust
- **Materials**: Iron, steel, coal, machinery
- **Colors**: Grays, browns with metallic highlights
- **Examples**: Iron, Steel, Coal, Machinery, Tools

#### **Modern Era (Modern, Networked, Digital)**
- **Aesthetic**: Clean lines, synthetic materials, technology
- **Materials**: Plastics, electronics, refined metals
- **Colors**: Bright accents on neutral backgrounds
- **Examples**: Electronics, PlasticGoods, Chemicals

#### **Future Era (Stellar, Quantum, Ethereal)**
- **Aesthetic**: Otherworldly, energy-based, exotic
- **Materials**: Energy crystals, exotic matter, quantum materials
- **Colors**: Bright, otherworldly hues with glow effects
- **Examples**: Aetherium, Quantum materials, PlasmaGel

### Era Selection Guidelines

- **Default to Classical**: Most goods start in Classical era
- **Material-based selection**: Choose era based on when good becomes available
- **Cultural context**: Consider technological development timeline
- **Visual coherence**: Maintain consistency within era families

## Category-Based Design Patterns

### Category Visual Identifiers

Each good category has distinct visual characteristics:

#### **RawMaterial**
- **Shape**: Natural, unprocessed forms
- **Texture**: Visible material properties
- **Examples**: Wood grain, metal ingots, stone blocks
- **Colors**: Natural material colors

#### **Food**
- **Shape**: Edible items or containers
- **Texture**: Appetizing, fresh appearance
- **Examples**: Fruits, grains, prepared foods
- **Colors**: Warm, appetizing tones

#### **Tool**
- **Shape**: Functional implements
- **Texture**: Working surfaces and handles
- **Examples**: Hammers, gears, mechanical parts
- **Colors**: Metallic with wear indicators

#### **Material**
- **Shape**: Processed or refined goods
- **Texture**: Worked materials with finish
- **Examples**: Cloth, processed metals, glass
- **Colors**: Refined, processed appearances

#### **Luxury**
- **Shape**: Ornate, valuable items
- **Texture**: Precious materials, fine craftsmanship
- **Examples**: Jewelry, gems, precious metals
- **Colors**: Rich, valuable color palettes

#### **Knowledge**
- **Shape**: Information-bearing items
- **Texture**: Written or recorded media
- **Examples**: Books, scrolls, data storage
- **Colors**: Scholarly, muted tones

#### **Energy**
- **Shape**: Power sources or fuel
- **Texture**: Energy representation
- **Examples**: Batteries, fuel cells, power crystals
- **Colors**: Energetic, high-contrast

## Workflow and Process

### Art Asset Creation Process

#### 1. **Planning Phase**
- Review icon registry for placeholder status
- Identify era and category requirements
- Gather reference materials for style consistency
- Plan color palette and composition

#### 2. **Design Phase**
- Create 64x32 pixel canvas
- Establish basic silhouette and composition
- Apply era-appropriate styling
- Test readability at target size

#### 3. **Refinement Phase**
- Add texture and detail while maintaining clarity
- Ensure pixel grid alignment
- Apply consistent line weights
- Validate against style guidelines

#### 4. **Quality Assurance**
- Test at multiple sizes (16px, 32px, 64px)
- Verify contrast and readability
- Check against existing icon family
- Validate technical specifications

#### 5. **Delivery Phase**
- Export optimized PNG files
- Update registry with new asset paths
- Document creation in project records
- Submit for integration testing

### Quality Checklist

#### **Visual Quality**
- [ ] Icon is recognizable at 16x8 pixels
- [ ] Silhouette clearly represents the good
- [ ] Era styling is appropriate and consistent
- [ ] Category visual language is maintained
- [ ] Color palette follows guidelines

#### **Technical Quality**
- [ ] Pixel-perfect alignment to grid
- [ ] Proper file naming convention
- [ ] Correct resolution and format
- [ ] File size within limits
- [ ] Transparency properly implemented

#### **Consistency Quality**
- [ ] Matches existing icon style
- [ ] Era evolution is logical
- [ ] Category patterns are maintained
- [ ] No conflicting visual language
- [ ] Fits overall art direction

## Integration Guidelines

### Registry Updates

When new icons are created or updated:

1. **Update icon registry** with new asset paths
2. **Mark status** as 'complete' in registry
3. **Add metadata** including creation date and artist
4. **Test integration** with UI components
5. **Update documentation** with any style evolution

### Backwards Compatibility

- **Legacy support**: Maintain old asset paths where possible
- **Graceful degradation**: Fallback to placeholder for missing assets
- **Version tracking**: Track icon version changes
- **Migration path**: Provide clear upgrade process

### Performance Optimization

- **Sprite sheets**: Consider sprite sheet generation for batch delivery
- **Lazy loading**: Implement lazy loading for large icon sets
- **Caching strategy**: Optimize browser caching for icon assets
- **Progressive enhancement**: Provide placeholder-first experience

## Common Issues and Solutions

### Typical Art Direction Problems

#### **Overly Complex Details**
- **Problem**: Icons become unreadable at small sizes
- **Solution**: Simplify to essential silhouette elements
- **Rule of thumb**: If you can't see it at 16x8, it's too complex

#### **Inconsistent Era Styling**
- **Problem**: Icons don't match their assigned era
- **Solution**: Review era guidelines and reference materials
- **Check**: Compare with established era icon families

#### **Poor Category Recognition**
- **Problem**: Icons don't clearly indicate their category
- **Solution**: Strengthen category visual language
- **Review**: Test category recognition with blind testing

#### **Technical Artifacts**
- **Problem**: Anti-aliasing, sub-pixel positioning, or compression artifacts
- **Solution**: Strict adherence to technical specifications
- **Prevention**: Use appropriate tools and validate against specs

### Troubleshooting Guide

#### **Icon Not Loading**
1. Check file path and naming convention
2. Verify file exists in expected location
3. Test file corruption with image viewer
4. Check browser console for 404 errors

#### **Poor Visual Quality**
1. Verify pixel grid alignment
2. Check for anti-aliasing in source files
3. Ensure proper resolution scaling
4. Review compression settings

#### **Inconsistent Styling**
1. Compare against style guide examples
2. Check era classification
3. Review category visual patterns
4. Validate against existing icon family

## Future Considerations

### Scalability Planning

- **Additional resolutions**: Plan for future high-DPI displays
- **Animation support**: Consider animated icon variants
- **Theming system**: Support for alternate art styles
- **Localization**: Consider cultural adaptation requirements

### Technology Evolution

- **Vector graphics**: Potential migration to SVG for scalability
- **WebP format**: Evaluate modern image formats
- **Sprite atlases**: Automated sprite sheet generation
- **CDN integration**: Optimize global asset delivery

### Process Improvements

- **Automated validation**: Tools for style compliance checking
- **Batch processing**: Streamlined asset generation workflows
- **Version control**: Better tracking of icon evolution
- **Collaboration tools**: Enhanced artist-designer workflows

## Conclusion

These guidelines ensure that all goods icons maintain visual consistency, technical quality, and cultural authenticity within the Megalomania project. Following these standards will result in a cohesive, professional icon set that enhances user experience and supports the game's broader art direction.

For questions or clarifications, refer to the development team or consult the icon registry service documentation.