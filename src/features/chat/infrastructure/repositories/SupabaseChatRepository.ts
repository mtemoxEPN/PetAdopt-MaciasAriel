import { supabase } from "@shared/infrastructure/supabase/client";
import { Message, Room } from "@features/chat/domain/entities/Message";
import { IChatRepository } from "@features/chat/domain/repositories/IChatRepository";

export class SupabaseChatRepository implements IChatRepository {

    async getRooms(): Promise<Room[]> {
        const { data, error } = await supabase
            .from("rooms")
            .select("*")
            .order("created_at", { ascending: false });
        if (error) throw error;
        return (data ?? []).map(this.mapRoom);
    }

    async createRoom(
        name:                string,
        userId:              string,
        productName?:        string,
        productDescription?: string,
        productPrice?:       number,
    ): Promise<Room> {
        const { data, error } = await supabase
            .from("rooms")
            .insert({
                name,
                created_by:          userId,
                product_name:        productName,
                product_description: productDescription,
                product_price:       productPrice,
            })
            .select()
            .single();
        if (error) throw error;
        return this.mapRoom(data);
    }

    async getMessages(roomId: string): Promise<Message[]> {
        const { data, error } = await supabase
            .from("messages")
            .select("id, room_id, user_id, content, created_at, image_url, profiles(username, role)")
            .eq("room_id", roomId)
            .order("created_at", { ascending: true })
            .limit(50);
        if (error) throw error;
        return (data ?? []).map(this.mapMessage);
    }

    async sendMessage(
        roomId:    string,
        userId:    string,
        content:   string,
        imageUrl?: string,
    ): Promise<Message> {
        const { data, error } = await supabase
            .from("messages")
            .insert({ room_id: roomId, user_id: userId, content, image_url: imageUrl })
            .select("id, room_id, user_id, content, created_at, image_url, profiles(username, role)")
            .single();
        if (error) throw error;
        return this.mapMessage(data);
    }

    subscribeToRoom(roomId: string, onMessage: (msg: Message) => void): () => void {
        const channel = supabase
            .channel(`room:${roomId}`)
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "messages", filter: `room_id=eq.${roomId}` },
                async (payload) => {
                    const { data: profile } = await supabase
                        .from("profiles")
                        .select("username, role")
                        .eq("id", payload.new.user_id)
                        .single();

                    onMessage({
                        id:             payload.new.id,
                        roomId:         payload.new.room_id,
                        userId:         payload.new.user_id,
                        content:        payload.new.content,
                        createdAt:      new Date(payload.new.created_at),
                        authorUsername: profile?.username,
                        authorRole:     profile?.role ?? "client",
                        imageUrl:       payload.new.image_url ?? undefined,
                    });
                }
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }

    private mapRoom = (raw: any): Room => ({
        id:                 raw.id,
        name:               raw.name,
        createdBy:          raw.created_by,
        createdAt:          new Date(raw.created_at),
        productName:        raw.product_name ?? undefined,
        productDescription: raw.product_description ?? undefined,
        productPrice:       raw.product_price ?? undefined,
    });

    private mapMessage = (raw: any): Message => ({
        id:             raw.id,
        roomId:         raw.room_id,
        userId:         raw.user_id,
        content:        raw.content,
        createdAt:      new Date(raw.created_at),
        authorUsername: raw.profiles?.username,
        authorRole:     raw.profiles?.role ?? "client",
        imageUrl:       raw.image_url ?? undefined,
    });
}