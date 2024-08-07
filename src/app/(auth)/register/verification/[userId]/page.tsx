"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/components/ui/input-otp";

import { useState } from "react";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { Button } from "~/components/ui/button";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

import axios from "axios";

export default function verificationPage() {
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [verificationError, setVerificationError] = useState<boolean>(false);
  const [unknownError, setUnknownError] = useState<boolean>(false);

  const { userId } = useParams();
  const router = useRouter();

  const submitVerification = async () => {
    try {
      const response = await axios.post("/api/auth/register/verification", {
        verificationCode,
        userId,
      });
      if (response.status == 200) router.push("/login");
    } catch (error: any) {
      if (error.response.status == 403) setVerificationError(true);
      else setUnknownError(true);
    }
  };

  return (
    <div className="flex justify-center pt-40">
      <div className="m-6 flex w-full flex-col gap-8 rounded-sm border-2 p-10 md:m-0 md:w-1/5">
        <div className="flex justify-center text-3xl font-semibold">
          <span className="text-blue-600">Expense</span>Tracker
        </div>
        <div className="text-center">
          Verification code has been sent to your email address!
        </div>

        <div className="flex flex-col justify-center gap-2">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              value={verificationCode}
              onChange={(value) => setVerificationCode(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          {verificationError == true ? (
            <div className="text-center text-sm text-red-600">
              Wrong verification code!
            </div>
          ) : (
            <></>
          )}
          {unknownError == true ? (
            <div className="text-center text-sm text-red-600">
              Something went wrong!
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className="flex justify-center p-6">
          <Button className="w-full" onClick={() => submitVerification()}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
