"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { z } from "zod";
import { Button } from "../ui/button";
import { doCredentialLogin } from "@/actions/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
const formSchema = z.object({
  email: z.string().min(2, {
    message: "Faltan letras",
  }),
  password: z.string().min(5, {
    message: "Faltan letras",
  }),
});

export const LoginForm = () => {
  const [errorMessage, setError] = useState<null | string>(null);

  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await doCredentialLogin(values);
      if (!response.ok) {
        setError(response.message);
      } else {
        router.push("/");
      }
    } catch (e) {
      setError("Check your Credentials");
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="mateo@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {errorMessage && <FormMessage>{errorMessage}</FormMessage>}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
