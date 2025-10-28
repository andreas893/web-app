// src/services/firebaseChat.js

import {
    doc,
    collection,
    addDoc,
    serverTimestamp,
    onSnapshot,
    query,
    orderBy,
    setDoc,
    updateDoc,
    deleteDoc,
  } from "firebase/firestore";
  import { db } from "../firebase";
  
  // Sikrer at chat-dokumentet findes
  async function ensureChatExists(chatId, members) {
    const chatRef = doc(db, "chats", chatId);
    await setDoc(
      chatRef,
      {
        members,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }
  
  // Realtime listener på beskeder i en chat
  export function listenToMessages(chatId, callback) {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));
  
    const unsub = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      callback(msgs);
    });
  
    return unsub;
  }
  
  // Send tekstbesked
  export async function sendTextMessage(chatId, senderUid, text, members) {
    await ensureChatExists(chatId, members);
  
    const messagesRef = collection(db, "chats", chatId, "messages");
    await addDoc(messagesRef, {
      senderUid,
      type: "text",
      text,
      createdAt: serverTimestamp(),
    });
  }
  
  // Send sangbesked (gemmer kun trackId)
  export async function sendSongMessage(chatId, senderUid, trackId, members) {
    await ensureChatExists(chatId, members);
  
    const messagesRef = collection(db, "chats", chatId, "messages");
    await addDoc(messagesRef, {
      senderUid,
      type: "song",
      song: {
        trackId,
      },
      createdAt: serverTimestamp(),
    });
  }
  
  // Opdater tekstbesked (kun din egen)
  export async function updateMessage(chatId, messageId, newText) {
    const ref = doc(db, "chats", chatId, "messages", messageId);
    await updateDoc(ref, { text: newText });
  }
  
  // Slet besked (kun din egen)
  export async function deleteMessage(chatId, messageId) {
    const ref = doc(db, "chats", chatId, "messages", messageId);
    await deleteDoc(ref);
  }
  