import { useEffect, useState } from "react";
import {
    View,
    Alert,
    TextInput,
    Text,
    Share,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useVault } from "@/context/vault";
import { Encrypter } from "@/lib/encrypter";
import { api } from "@/lib/api";
import Container from "@/components/Container";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { Avatar, Button, Input } from "heroui-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthContext } from "@/context/auth-context";
import { useTranslation } from "react-i18next";

export default function InviteMemberScreen() {
    const { t } = useTranslation();
    const { vaultId } = useLocalSearchParams<{ vaultId: string }>();
    const router = useRouter();
    const { user } = useAuthContext();
    const { masterKey, data: vault } = useVault({ withContent: false }); // Açık olan kasanın anahtarı

    const [email, setEmail] = useState("");
    const [invitePassword, setInvitePassword] = useState(""); // Bob için belirlenen şifre
    const [isLoading, setIsLoading] = useState(false);

    // Member Management State
    const [members, setMembers] = useState<any[]>([]);
    const [isLoadingMembers, setIsLoadingMembers] = useState(true);

    const isEncrypted = vault?.isEncrypted;

    const fetchMembers = async () => {
        try {
            const res = await api.get(`/vaults/${vaultId}/members`);
            if (res.data?.success) {
                setMembers(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch members:", error);
        } finally {
            setIsLoadingMembers(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, [vaultId]);

    const handleInvite = async () => {
        if (!email)
            return Alert.alert(
                t("common.error"),
                t("vaultInvite.errorEmailRequired"),
            );

        if (isEncrypted) {
            if (!invitePassword)
                return Alert.alert(
                    t("common.error"),
                    t("vaultInvite.errorPasswordRequired"),
                );
            if (invitePassword.length < 6)
                return Alert.alert(
                    t("common.error"),
                    t("vaultInvite.errorPasswordLength"),
                );
            if (!masterKey)
                return Alert.alert(
                    t("common.error"),
                    t("vaultInvite.errorLocked"),
                );
        }

        setIsLoading(true);
        try {
            let encryptedKey;
            let salt;

            if (isEncrypted) {
                // 2. Master Key'i, belirlediğimiz şifre ile paketle
                const result = Encrypter.encryptKeyWithNewPassword(
                    masterKey!,
                    invitePassword,
                );
                encryptedKey = result.encryptedKey;
                salt = result.salt;
            }

            // 3. Sunucuya gönder
            await api.post(`/vaults/${vaultId}/members`, {
                email: email,
                encryptedVaultKey: encryptedKey,
                salt: salt,
            });

            // 4. Kullanıcıyı bilgilendir
            if (isEncrypted) {
                Alert.alert(
                    t("vaultInvite.inviteSentTitle"),
                    t("vaultInvite.inviteSentEncryptedBody", {
                        password: invitePassword,
                    }),
                    [
                        {
                            text: t("vaultInvite.sharePasswordButton"),
                            onPress: () => {
                                Share.share({
                                    message: t("vaultInvite.shareMessage", {
                                        password: invitePassword,
                                    }),
                                });
                                fetchMembers();
                            },
                        },
                        {
                            text: t("vaultInvite.okButton") || t("common.ok"),
                            onPress: () => fetchMembers(),
                        },
                    ],
                );
            } else {
                Alert.alert(
                    t("vaultInvite.inviteSentTitle"),
                    t("vaultInvite.inviteSentBody"),
                    [
                        {
                            text: t("vaultInvite.okButton") || t("common.ok"),
                            onPress: () => fetchMembers(),
                        },
                    ],
                );
            }
            setEmail("");
            setInvitePassword("");
        } catch (error: any) {
            console.error(error);
            Alert.alert(
                t("common.error"),
                error.response?.data?.message || error.message,
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveMember = (member: any) => {
        Alert.alert(
            t("vaultInvite.removeMemberTitle"),
            t("vaultInvite.removeMemberConfirm", { name: member.name }),
            [
                { text: t("common.cancel"), style: "cancel" },
                {
                    text: t("common.remove"),
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const res = await api.delete(
                                `/vaults/${vaultId}/members/${member.id}`,
                            );
                            if (res.data?.success) {
                                setMembers((prev) =>
                                    prev.filter((m) => m.id !== member.id),
                                );
                            } else {
                                Alert.alert(
                                    t("common.error"),
                                    "Kullanıcı çıkarılamadı.",
                                );
                            }
                        } catch (error: any) {
                            Alert.alert(
                                t("common.error"),
                                error.response?.data?.message ||
                                    "Bir hata oluştu",
                            );
                        }
                    },
                },
            ],
        );
    };

    // Check if current user is owner (assuming first admin is owner or based on flag)
    // We can check if `members` contains current user with `primaryOwner: true`
    const isOwner = members.find((m) => m.id === user?.id)?.primaryOwner;

    if (isLoading) return <Loading />;

    return (
        <Container>
            <Header
                title={t("vaultInvite.title")}
                onBack={() => router.back()}
            />
            <ScrollView
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="flex-col gap-6 p-4">
                    {/* Invite Section */}
                    <View className="gap-4">
                        <Text className="text-lg font-bold">
                            {t("vaultInvite.inviteSectionTitle")}
                        </Text>
                        <Text className="text-gray-500">
                            {isEncrypted
                                ? t("vaultInvite.inviteDescriptionEncrypted")
                                : t("vaultInvite.inviteDescription")}
                        </Text>

                        <Input
                            placeholder={t("vaultInvite.emailPlaceholder")}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            variant="secondary"
                        />

                        {isEncrypted && (
                            <Input
                                placeholder={t(
                                    "vaultInvite.passwordPlaceholder",
                                )}
                                value={invitePassword}
                                onChangeText={setInvitePassword}
                                secureTextEntry
                                variant="secondary"
                            />
                        )}

                        <Button onPress={handleInvite} size="lg">
                            {t("vaultInvite.sendButton")}
                        </Button>
                    </View>

                    {/* Members Section */}
                    <View className="mt-4 gap-4">
                        <Text className="text-lg font-bold">
                            {t("vaultInvite.membersSectionTitle")} (
                            {members.length})
                        </Text>

                        {isLoadingMembers ? (
                            <ActivityIndicator />
                        ) : (
                            <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden px-2">
                                {members.map((member) => (
                                    <View
                                        key={member.id}
                                        className="flex-row items-center p-3 border-b border-gray-50 last:border-0"
                                    >
                                        <Avatar
                                            size="sm"
                                            alt={member.name}
                                            className="mr-3"
                                        >
                                            <Avatar.Image src={member.image} />
                                            <Avatar.Fallback>
                                                {member.name?.[0]}
                                            </Avatar.Fallback>
                                        </Avatar>
                                        <View className="flex-1">
                                            <Text className="font-medium text-gray-900">
                                                {member.name}{" "}
                                                {member.id === user?.id &&
                                                    t("vaultInvite.youSuffix")}
                                            </Text>
                                            <Text className="text-xs text-gray-500">
                                                {member.email}
                                            </Text>
                                        </View>
                                        {member.primaryOwner && (
                                            <View className="bg-blue-100 px-2 py-1 rounded-md mr-2">
                                                <Text className="text-blue-700 text-xs font-bold">
                                                    {t(
                                                        "vaultInvite.ownerBadge",
                                                    )}
                                                </Text>
                                            </View>
                                        )}

                                        {/* Delete Button (Only for owner, can't delete self or other owners if logic exists) */}
                                        {isOwner && !member.primaryOwner && (
                                            <TouchableOpacity
                                                onPress={() =>
                                                    handleRemoveMember(member)
                                                }
                                                className="w-8 h-8 items-center justify-center bg-red-50 rounded-full"
                                            >
                                                <Ionicons
                                                    name="trash-outline"
                                                    size={16}
                                                    color="#ef4444"
                                                />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </Container>
    );
}
