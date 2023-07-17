import { FlatList, HStack, Heading, Text, VStack } from "native-base";
import { HomeHeader } from "../components/HomeHeader";
import { Group } from "../components/Group";
import { useState } from "react";

export function Home() {
  const [groupSelected, setGroupSelected] = useState("costa");
  const [groups, setGroups] = useState([
    "Costas",
    "Bíceps",
    "Tríceps",
    "Ombros",
  ]);

  return (
    <VStack flex={1}>
      <HomeHeader />
      <FlatList
        data={groups}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            isActive={groupSelected === item}
            onPress={() => setGroupSelected(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{ px: 8 }}
        my={10}
        maxHeight={10}
      />
      <VStack flex={1} px={8}>
        <HStack justifyContent="space-between" mb={5}>
          <Heading color="gray.200" fontSize="md">
            Exercícios
          </Heading>
          <Text color="gray.200" fontSize="sm">
            4
          </Text>
        </HStack>
      </VStack>
    </VStack>
  );
}
