import { Center, Heading, Image, Text, VStack, ScrollView } from "native-base";
import backgroundImage from "../assets/background.png";
import LogoImageSvg from "../assets/logo.svg";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  password_confirm: string;
};

export function SignUp() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>();
  const navigation = useNavigation();

  function handleGoBack() {
    navigation.goBack();
  }

  function handleSignUp(data: FormDataProps) {
    console.log(data);
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} bg="gray.700" px={10} pb={16}>
        <Image
          source={backgroundImage}
          defaultSource={backgroundImage}
          alt="Pessoas treinando"
          resizeMode="contain"
          position="absolute"
        />
        <Center my={24}>
          <LogoImageSvg />
          <Text color="gray.100" fontSize="sm">
            Treine sua mente e o seu corpo
          </Text>
        </Center>
        <Center>
          <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
            Crie sua conta
          </Heading>
          <Controller
            control={control}
            name="name"
            rules={{
              required: "Informe o nome.",
            }}
            render={({ field: { onChange, value } }) => (
              <Input placeholder="Nome" value={value} onChangeText={onChange} />
            )}
          />
          <Text color="white">{errors.name?.message}</Text>
          <Controller
            control={control}
            name="email"
            rules={{
              required: "Informe o email.",
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          <Text color="white">{errors.email?.message}</Text>
          <Controller
            control={control}
            name="password"
            rules={{
              required: "Informe a senha.",
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Senha"
                secureTextEntry
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          <Text color="white">{errors.password?.message}</Text>
          <Controller
            control={control}
            name="password_confirm"
            rules={{
              required: "Por favor, a senha precisa ser a mesma.",
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Confirme a senha"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                onSubmitEditing={handleSubmit(handleSignUp)}
                returnKeyType="send"
              />
            )}
          />
          <Text color="white">{errors.password_confirm?.message}</Text>
          <Button
            title="Criar e acessar"
            onPress={handleSubmit(handleSignUp)}
          />
        </Center>
        <Button
          mt={24}
          title="Voltar para o login"
          variant="outline"
          onPress={handleGoBack}
        />
      </VStack>
    </ScrollView>
  );
}
