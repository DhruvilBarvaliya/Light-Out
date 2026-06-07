import React from 'react';
import { ScrollView, Text, View } from 'react-native';

import { DemoTutorial } from './DemoTutorial';

const RULES = [
  {
    step: '1',
    title: 'Turn off every light',
    description: 'The goal is to switch off all the lights on the board.',
  },
  {
    step: '2',
    title: 'Tap a cell to toggle',
    description: 'Tapping a light flips it — on becomes off, off becomes on.',
  },
  {
    step: '3',
    title: 'Neighbors toggle too',
    description: 'The cells directly above, below, left, and right also flip.',
  },
  {
    step: '4',
    title: 'Plan your moves',
    description: 'Order matters. Think ahead to clear the whole grid.',
  },
];

function MiniGrid() {
  const cells = [
    'off',
    'on',
    'off',
    'on',
    'active',
    'on',
    'off',
    'on',
    'off',
  ] as const;

  return (
    <View className="my-4 items-center">
      <Text className="mb-3 text-xs uppercase tracking-wider text-slate-500">Example tap</Text>
      <View className="flex-row flex-wrap justify-center gap-1.5" style={{ width: 108 }}>
        {cells.map((state, index) => (
          <View
            key={index}
            className={`h-8 w-8 rounded-md ${
              state === 'active'
                ? 'border-2 border-cyan-400 bg-amber-300'
                : state === 'on'
                  ? 'bg-amber-400'
                  : 'bg-[#2a1f5c]'
            }`}
          />
        ))}
      </View>
      <Text className="mt-3 text-center text-xs text-slate-500">
        Tapping the center flips it and its four neighbors.
      </Text>
    </View>
  );
}

function RuleItem({ step, title, description }: (typeof RULES)[number]) {
  return (
    <View className="mb-4 flex-row gap-3">
      <View className="h-8 w-8 items-center justify-center rounded-full bg-cyan-400/20">
        <Text className="text-sm font-bold text-cyan-300">{step}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold text-white">{title}</Text>
        <Text className="mt-1 text-sm leading-5 text-slate-400">{description}</Text>
      </View>
    </View>
  );
}

export function GameRules() {
  return (
    <View className="w-full max-w-sm flex-1 self-center rounded-2xl border border-cyan-400/20 bg-[#1a1040]">
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-5 pb-6"
        showsVerticalScrollIndicator>
        <Text className="text-center text-xl font-bold text-white">How to Play</Text>
        <Text className="mt-1 text-center text-sm text-slate-400">Light Out puzzle rules</Text>

        <MiniGrid />

        <DemoTutorial />

        {RULES.map((rule) => (
          <RuleItem key={rule.step} {...rule} />
        ))}
      </ScrollView>
    </View>
  );
}
