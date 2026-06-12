export function calculateParallaxLayer(scrollPos, parallaxScale, parallaxOffset, textureWidth, tileWidth, screenWidth, screenEdgeOverdraw) {
    const scaledPos = scrollPos * parallaxScale + parallaxOffset;
    const startTile = Math.floor(scaledPos / tileWidth);
    const subTileOffset = scaledPos - tileWidth * startTile;
    const tilesInTexture = Math.floor(textureWidth / tileWidth);
    const endTile = Math.ceil((scaledPos + screenWidth + 2 * screenEdgeOverdraw) / tileWidth);
    const drawStartX = -subTileOffset - screenEdgeOverdraw;
    const startTileIndex = startTile % tilesInTexture;
    const tilesToDraw = endTile - startTile;
    return { drawStartX, startTileIndex, tilesToDraw };
}
