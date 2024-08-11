"use client"

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
import { useParams, useRouter } from "next/navigation";

const formSchema = z.object({
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, { message: "Password don't match", path: ["confirmPassword"], });

export default function ResetPasswordPage() {
  const searchParams = useParams<{ id: string }>();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const resetPasswordMutation = useMutation({
    mutationKey: ["resetPasswordMutation"],
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const userId = searchParams.id;
      const response = await axios.put("/api/auth/resetPassword", JSON.stringify({ "password": values.password, "userId": userId }));
      return response.data;
    },
    onSuccess: () => {
      router.push("/login");
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    resetPasswordMutation.mutate(values)
  }

  return (
    <div className="flex justify-center pt-32">
      <div className="m-6 flex w-full flex-col gap-8 rounded-sm border-2 p-10 md:m-0 md:w-1/5">
        <div className="flex justify-center text-3xl font-semibold">
          <span className="text-blue-600">Expense</span>Tracker
        </div>
        <div>
          <div className="flex flex-col gap-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="flex flex-col gap-2">
                  <FormField
                    control={form.control}
                    name="password"
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
                  {resetPasswordMutation.isPending ? <>Submiting...</> : <>Reset password</>}
                </Button>
              </form>
            </Form>
          </div>
        </div>
        <div className="flex justify-center font-semibold">
          {resetPasswordMutation.isSuccess ? <div>Password updated!</div> : <></>}
        </div>
      </div>
    </div>
  );
}
