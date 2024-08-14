"use client";

import { Button } from "~/components/ui/button";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { TError } from "~/types/types";

import { useState } from "react";

import { useRouter } from "next/navigation";

const formSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 3 characters." }),
    email: z.string().min(2, {
      message: "Email must be at least 2 characters.",
    }),
    password: z.string().min(2, {
      message: "Password must be at least 3 characters.",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const [errorMessage, setErrorMessage] = useState<String>("");

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerMutation = useMutation({
    mutationKey: ["registration"],
    mutationFn: async (user: z.infer<typeof formSchema>) => {
      const response = await axios.post("/api/auth/register", user);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      router.push(`/register/verification/${data.userId}`);
    },
    onError: (error: TError, variables, context) => {
      setErrorMessage(error.response.statusText);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setErrorMessage("");
    registerMutation.mutate(values);
  }

  return (
    <div className="flex justify-center pt-32">
      <div className="m-6 flex w-full flex-col gap-8 rounded-sm border-2 p-10 md:m-0 md:w-1/5">
        <div className="flex justify-center text-3xl font-semibold">
          <span className="text-blue-600">Expense</span>Tracker
        </div>
        <div>
          {errorMessage != "" ? (
            <div className="text-center text-sm text-red-500">
              {errorMessage}
            </div>
          ) : null}
          <div className="flex flex-col gap-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="flex flex-col gap-2">
                  <FormField
                    control={form.control}
                    defaultValue=""
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    defaultValue=""
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your email address..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    defaultValue=""
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Your password..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    defaultValue=""
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Your password..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full">
                  {registerMutation.isPending ? (
                    <>Submiting...</>
                  ) : (
                    <>Register</>
                  )}
                </Button>
              </form>
            </Form>
            <div className="text-sm text-primary">
              Have an account?{" "}
              <span
                onClick={() => router.push("/login")}
                className="text-blue-600 hover:cursor-pointer hover:underline"
              >
                Log in here!
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
