import {
  Center,
  ScrollView,
  Text,
  VStack,
  Skeleton,
  Heading,
  useToast,
} from "native-base";
import { ScreenHeader } from "../components/ScreenHeader";
import { UserPhoto } from "../components/UserPhoto";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { FileInfo } from "expo-file-system";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../hooks/useAuth";

type FormDataProps = {
  name: string;
  email: string;
  old_password: string;
  new_password: string;
  confirm_password: string;
};

const profileSchema = yup.object({
  name: yup.string().min(3, "O nome precisa ter pelo menos 3 letras."),
  email: yup.string().required("Informe um email.").email("E-mail inválido."),
  old_password: yup
    .string()
    .min(6, "A senha precisa ter pelo menos 6 dígitos."),
  new_password: yup
    .string()
    .min(6, "A nova senha precisa ter pelo menos 6 dígitos.")
    .nullable()
    .transform((value) => (!!value ? value : null)),
  confirm_password: yup
    .string()
    .nullable()
    .transform((value) => (!!value ? value : null))
    .oneOf([yup.ref("new_password")], "A confirmação da senha não confere.")
    .when("new_password", {
      is: (Field: any) => Field,
      then: (schema) =>
        schema.nullable().required("Informe a confirmação de senha."),
    }),
});

const PHOTO_SIZE = 33;

export function Profile() {
  const [photoIsLoading, setPhotoIsLoading] = useState(false);
  const [userPhoto, setUserPhoto] = useState(
    "https://github.com/RayanneRamos.png"
  );
  const { user } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });
  const toast = useToast();

  async function handleUserPhotoSelect() {
    setPhotoIsLoading(true);
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });

      if (photoSelected.canceled) {
        return;
      }

      if (photoSelected.assets[0].uri) {
        const photoInfo = (await FileSystem.getInfoAsync(
          photoSelected.assets[0].uri
        )) as FileInfo;

        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            title: "Essa imagem é muito grande. Escolha uma de até 5MB.",
            placement: "top",
            bgColor: "red.500",
          });
        }

        setUserPhoto(photoSelected.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setPhotoIsLoading(false);
    }
  }

  async function handleProfileUpdate(data: FormDataProps) {
    console.log(data);
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />
      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt={6} px={10}>
          {photoIsLoading ? (
            <Skeleton
              w={PHOTO_SIZE}
              h={PHOTO_SIZE}
              rounded="full"
              startColor="gray.500"
              endColor="gray.400"
            />
          ) : (
            <UserPhoto
              source={{ uri: userPhoto }}
              alt="Foto do usuário"
              size={PHOTO_SIZE}
            />
          )}
          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text
              color="green.500"
              fontSize="md"
              fontWeight="bold"
              mt={2}
              mb={8}
            >
              Alterar foto
            </Text>
          </TouchableOpacity>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Nome"
                bg="gray.600"
                value={value}
                onChangeText={onChange}
                errorMessage={errors.name?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                bg="gray.600"
                placeholder="Email"
                isDisabled
                value={value}
                onChangeText={onChange}
                errorMessage={errors.email?.message}
              />
            )}
          />

          <Heading
            color="gray.200"
            fontSize="md"
            mb={2}
            alignSelf="flex-start"
            mt={12}
            fontFamily="heading"
          >
            Alterar senha
          </Heading>
          <Controller
            control={control}
            name="old_password"
            render={({ field: { onChange, value } }) => (
              <Input
                bg="gray.600"
                placeholder="Senha antiga"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                errorMessage={errors.old_password?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="new_password"
            render={({ field: { onChange, value } }) => (
              <Input
                bg="gray.600"
                placeholder="Nova senha"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                errorMessage={errors.new_password?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="confirm_password"
            render={({ field: { onChange, value } }) => (
              <Input
                bg="gray.600"
                placeholder="Confirme a nova senha"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                errorMessage={errors.confirm_password?.message}
              />
            )}
          />

          <Button
            title="Atualizar"
            mt={4}
            onPress={handleSubmit(handleProfileUpdate)}
          />
        </Center>
      </ScrollView>
    </VStack>
  );
}
