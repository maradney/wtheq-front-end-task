'use client';

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Card, Flex, Text, Avatar, Box, TextField, Select, Button } from "@radix-ui/themes";
import { IconChevronUp, IconFile, IconPencil, IconUserCircle, IconUserCode } from "@tabler/icons-react";
import { DayPicker } from "react-day-picker";

import dayjs from "dayjs";
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import * as yup from "yup";

import "react-day-picker/dist/style.css";

dayjs.extend(LocalizedFormat);

enum Genders {
  MALE = 'male',
  FEMALE = 'female',
  NOTSPECIFIED = 'not specified',
}

const schema = yup
  .object({
    name: yup.string().required(),
    title: yup.string().required(),
    gender: yup.mixed<Genders>().oneOf(Object.values(Genders)).required(),
    dateOfBirth: yup.date().required(),
  })
  .required();

type UserProfile = {
  name: string;
  title: string;
  gender: Genders;
  dateOfBirth: Date;
};

export default function Profile() {
  const [displayEditForm, setDisplayEditForm] = useState(false);
  const [selectedDOB, setSelectedDOB] = useState<Date | undefined>();
  const [selectedGender, setSelectedGender] = useState<Genders | undefined>();
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Teodros Girmay',
    title: 'Senior front-end engineer',
    gender: Genders.MALE,
    dateOfBirth: new Date(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: profile,
  });

  useEffect(() => {
    if (profile) {
      setSelectedDOB(profile.dateOfBirth);
      setSelectedGender(profile.gender);
    }
  }, []);

  useEffect(() => {
    if (selectedDOB) {
      setValue('dateOfBirth', selectedDOB);
    }
  }, [selectedDOB, setValue]);

  useEffect(() => {
    if (selectedGender) {
      setValue('gender', selectedGender);
    }
  }, [selectedGender, setValue]);

  const onSubmit = (data: UserProfile) => {
    setProfile(data);
  }

  return (
    <Flex gap="8" direction="column">
      <Card className="w-full">
        <Flex justify='between'>
          <Flex gap="4" align="center">
            <Avatar
              size="3"
              src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
              radius="full"
              fallback="T"
            />
            <Box>
              <Text as="div" size="2" weight="bold" className="capitalize">
                {profile.name}
              </Text>
              <Text as="div" size="2" color="gray" className="capitalize">
                {profile.title}
              </Text>
              <Text as="div" size="2" color="gray" className="capitalize">
                {profile.gender}
              </Text>
              <Text as="div" size="2" color="gray">
                {dayjs(profile.dateOfBirth).format('ll')}
              </Text>
            </Box>
          </Flex>
          <Flex direction="column" justify="center" align="center">
            <Button
              color="cyan"
              className="!cursor-pointer"
              onClick={() => {
                setDisplayEditForm((prevValue) => !prevValue);
              }}
            >
              {
                displayEditForm ? (
                  <IconChevronUp />
                ) : (
                  <IconPencil />
                )
              }
            </Button>
          </Flex>
        </Flex>
      </Card>
      {
        displayEditForm && (
          <form>
            <Flex gap="4">
              <Flex gap="4" direction="column" className="w-1/2">
                <Flex gap="1" direction="column">
                  <TextField.Root>
                    <TextField.Slot>
                      <IconUserCircle height="16" width="16" />
                    </TextField.Slot>
                    <TextField.Input placeholder="Name" {...register("name")} />
                  </TextField.Root>
                  <Text color="red" size="1" className="italic">
                    {errors.name?.message}
                  </Text>
                </Flex>

                <Flex gap="1" direction="column">
                  <TextField.Root>
                    <TextField.Slot>
                      <IconUserCode height="16" width="16" />
                    </TextField.Slot>
                    <TextField.Input placeholder="Title" {...register("title")} />
                  </TextField.Root>
                  <Text color="red" size="1" className="italic">
                    {errors.title?.message}
                  </Text>
                </Flex>

                <Flex gap="1" direction="column">
                  <Select.Root
                    value={selectedGender}
                    onValueChange={(value) => {
                      setSelectedGender(value as Genders);
                    }}
                  >
                    <Select.Trigger placeholder="Genders" />
                    <Select.Content>
                      <Select.Group>
                        <Select.Label>
                          Genders
                        </Select.Label>
                        {
                          Object.values(Genders).map((gender, i) => {
                            return (
                              <Select.Item key={`gender-select-${i}`} value={gender} className="capitalize">{gender}</Select.Item>
                            );
                          })
                        }
                      </Select.Group>
                    </Select.Content>
                  </Select.Root>
                  <Text color="red" size="1" className="italic">
                    {errors.gender?.message}
                  </Text>
                </Flex>
                <Button
                  color="cyan"
                  className="!cursor-pointer"
                  onClick={handleSubmit(onSubmit)}
                >
                  <IconFile />
                  Save data
                </Button>
              </Flex>

              <Flex gap="1" direction="column" className="w-1/2">
                <Text size="3" color="gray" weight="light">
                  Date of birth
                </Text>
                <DayPicker
                  mode="single"
                  captionLayout="dropdown"
                  fromYear={1970}
                  toYear={(new Date()).getFullYear()}
                  selected={selectedDOB}
                  onSelect={(date) => {
                    if (date) {
                      setSelectedDOB(date);
                    }
                  }}
                />
                <Text color="red" size="1" className="italic">
                  {errors.title?.message}
                </Text>
              </Flex>
            </Flex>
          </form>
        )
      }
    </Flex>
  )
}
