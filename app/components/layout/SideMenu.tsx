'use client';

import { useRouter, usePathname } from "next/navigation";
import { Button, Flex } from "@radix-ui/themes";
import { IconCreditCard, IconUserHexagon } from "@tabler/icons-react";

export default function SideMenu() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Flex direction="column" gap="2" className="w-1/3 h-fit p-4 bg-[#13162f] rounded-lg shadow-lg">
      <Button
        className="!cursor-pointer"
        color="mint"
        disabled={pathname.startsWith('/profile') || pathname === '/'}
        onClick={() => {
          router.push('/profile');
        }}
      >
        <IconUserHexagon />
        Profile
      </Button>
      <Button
        className="!cursor-pointer"
        color="mint"
        disabled={pathname.startsWith('/payment-info')}
        onClick={() => {
          router.push('/payment-info');
        }}
      >
        <IconCreditCard />
        Payment info
      </Button>
    </Flex>
  )
}
