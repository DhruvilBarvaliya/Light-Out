import React from 'react';
import { Pressable, View } from 'react-native';

import { CELL_GAP } from 'constants/gridConfig';
import { Grid } from 'utils/lightsOut';

interface GameBoardProps {
  grid: Grid;
  onCellPress: (row: number, col: number) => void;
  disabled?: boolean;
  cellSize?: number;
  lifelineMode?: boolean;
}

export function GameBoard({
  grid,
  onCellPress,
  disabled = false,
  cellSize = 48,
  lifelineMode = false,
}: GameBoardProps) {
  const size = grid.length;

  return (
    <View className="items-center justify-center" style={{ gap: CELL_GAP }}>
      {grid.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} className="flex-row" style={{ gap: CELL_GAP }}>
          {row.map((isOn, colIndex) => {
            const isLifelineTarget = lifelineMode && isOn;

            return (
              <Pressable
                key={`${rowIndex}-${colIndex}`}
                onPress={() => onCellPress(rowIndex, colIndex)}
                disabled={disabled}
                className={`items-center justify-center rounded-xl ${
                  isOn ? 'bg-amber-400' : 'bg-[#2a1f5c]'
                } ${isLifelineTarget ? 'bg-amber-300' : ''}`}
                style={{
                  width: cellSize,
                  height: cellSize,
                  ...(isLifelineTarget
                    ? {
                        shadowColor: '#c084fc',
                        shadowOpacity: 1,
                        shadowRadius: 10,
                        shadowOffset: { width: 0, height: 0 },
                        elevation: 8,
                      }
                    : isOn
                      ? {
                          shadowColor: '#fbbf24',
                          shadowOpacity: 0.35,
                          shadowRadius: 6,
                          shadowOffset: { width: 0, height: 0 },
                          elevation: 3,
                        }
                      : {}),
                }}
                accessibilityRole="button"
                accessibilityLabel={isOn ? 'Light on' : 'Light off'}
                accessibilityState={{ disabled }}>
                {isLifelineTarget ? (
                  <View className="absolute inset-1 rounded-lg border-2 border-purple-400" />
                ) : null}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}
