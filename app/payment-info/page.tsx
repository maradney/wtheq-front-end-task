'use client';

import { Card, Flex, Text, TextField, Button } from "@radix-ui/themes";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import Image from 'next/image';
import valid from 'card-validator';
import * as yup from "yup";

type CardInfo = {
  cardNumber: string;
  nameOnCard: string;
  expiryMonth: string;
  expiryYear: string;
  cvc: string;
};

type CreditCardTypes = 'visa' | 'mastercard' | 'american-express';

const schema = yup.object({
  cardNumber: yup.string()
    .label('Card number')
    .required()
    .min(4)
    .max(16)
    .test('test-credit-number', 'Credit Card number is invalid', value => {
      return valid.number(value).isValid;
    }),
  cvc: yup.string()
    .label('CVC')
    .required()
    .min(3)
    .max(4)
    .matches(/^[0-9]+$/, 'Invalid CVC number format'),
  nameOnCard: yup.string()
    .label('Card owner name')
    .required(),
  expiryMonth: yup.string()
    .label('Expiry month')
    .required()
    .min(2)
    .max(2)
    .test('is-valid-month', 'Month must be between 1 and 12', (value) => {
      return parseInt(value, 10) >= 1 && parseInt(value, 10) <= 12;
    }),
  expiryYear: yup.string()
    .label('Expiry Year')
    .required()
    .matches(/^(20)\d{2}$/, 'Invalid year format')
    .min(4)
    .max(4)
    .test('is-greater-than-or-equal', 'Year must be greater than or equal to the current year', (value) => {
      const currentYear = new Date().getFullYear();
      return parseInt(value, 10) >= currentYear;
    }),
}).required();

export default function PaymentInfo() {
  const autoRotatedOnce = useRef(false);
  const [rotated, setRotated] = useState(false);
  const [cardType, setCardType] = useState<CreditCardTypes | undefined>();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const cardNumber = getValues('cardNumber');
  const nameOnCard = getValues('nameOnCard');
  const expiryMonth = getValues('expiryMonth');
  const expiryYear = getValues('expiryYear');

  useEffect(() => {
    if (cardNumber && nameOnCard && expiryMonth && expiryYear && !autoRotatedOnce.current) {
      autoRotatedOnce.current = true;
      setRotated(true);
    }
  }, [cardNumber, nameOnCard, expiryMonth, expiryYear]);

  const onSubmit = (data: CardInfo) => {
    setRotated(false);
    setCardType(
      valid.number(data.cardNumber).card?.type as CreditCardTypes
    );
  }

  return (
    <>
      <Flex gap="1" direction="column">
        <Text color="red" size="1" className="italic">
          {errors.cardNumber?.message}
        </Text>
        <Text color="red" size="1" className="italic">
          {errors.expiryMonth?.message}
        </Text>
        <Text color="red" size="1" className="italic">
          {errors.expiryYear?.message}
        </Text>
        <Text color="red" size="1" className="italic">
          {errors.nameOnCard?.message}
        </Text>
        <Text color="red" size="1" className="italic">
          {errors.cvc?.message}
        </Text>
      </Flex>
      <Flex justify="center" align="center" className={`p-4 flip-card ${rotated ? 'rotated' : ''}`}>
        <Card className="w-[700px] h-[350px] rounded-lg flip-card-inner p-5">
          <Flex direction="column" justify="between" className="h-full w-full flip-card-front top-0 left-0">
            <Flex justify="between">
              <Text size="8">
                Credit Card
              </Text>
              <Text size="8">
                Bank Name
              </Text>
            </Flex>
            <Flex direction="column" justify="end" className="">
              {
                cardType === 'visa' && (
                  <Image src='/visa.png' width={80} height={80} alt="" />
                )
              }
              {
                cardType === 'mastercard' && (
                  <Image src='/mastercard.png' width={80} height={80} alt="" />
                )
              }
              {
                cardType === 'american-express' && (
                  <Image src='/american.png' width={80} height={80} alt="" />
                )
              }

              <Flex gap="1" direction="column">
                <TextField.Root>
                  <TextField.Input placeholder="XXXX-XXXX-XXXX-XXXX" {...register("cardNumber")} />
                </TextField.Root>
                <Text color="red" size="1" className="italic">
                  {errors.cardNumber?.message}
                </Text>
              </Flex>

              <Flex gap="1" justify="end">
                <TextField.Root>
                  <TextField.Input placeholder="XX" className="max-w-[50px]" {...register("expiryMonth")} />
                </TextField.Root>
                /
                <TextField.Root>
                  <TextField.Input placeholder="XX" className="max-w-[50px]" {...register("expiryYear")} />
                </TextField.Root>
              </Flex>
              <Flex gap="1" justify="end">
                <Flex gap="1" direction="column">
                  <Text color="red" size="1" className="italic">
                    {errors.expiryMonth?.message}
                  </Text>
                  <Text color="red" size="1" className="italic">
                    {errors.expiryYear?.message}
                  </Text>
                </Flex>
              </Flex>
              <Flex gap="1" direction="column">
                <TextField.Root className="max-w-[150px]">
                  <TextField.Input placeholder="Card Owner Name" {...register("nameOnCard")} />
                </TextField.Root>
                <Text color="red" size="1" className="italic">
                  {errors.nameOnCard?.message}
                </Text>
              </Flex>
            </Flex>
          </Flex>

          <Flex direction="column" justify="end" align="end" className={`h-full w-full flip-card-back top-0 right-0 ${rotated ? 'visible' : ''} pr-12 pb-8`}>
            <Flex gap="2" className="h-fit">
              <Text size="6">
                CVV
              </Text>
              <TextField.Root>
                <TextField.Input placeholder="XXX" className="max-w-[90px]" {...register("cvc")} />
              </TextField.Root>
              <Text color="red" size="1" className="italic">
                {errors.cvc?.message}
              </Text>
            </Flex>
          </Flex>
        </Card>
      </Flex>

      <Flex gap="2">
        <Button color="lime" onClick={() => { setRotated(prev => !prev) }}>
          flip
        </Button>
        <Button color="jade" onClick={handleSubmit(onSubmit)}>
          save
        </Button>
      </Flex>
    </>
  )
}
