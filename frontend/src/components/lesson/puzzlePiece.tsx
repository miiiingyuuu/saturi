import {
  Card,
  CardBody,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from "@nextui-org/react";
import { useRouter, usePathname } from "next/navigation";

interface IPuzzlePiece {
  locationId: number | null;
  piece:number;
}

export default function PuzzlePiece({ locationId, piece }: IPuzzlePiece) {
  const router = useRouter();
  const currentPath = usePathname();

  const startLesson = () => {
    router.push(`${currentPath}/${piece}`);
  };

  return (
    <div>
      <Popover placement="top">
        <PopoverTrigger>
          <Card className="w-24 h-24">
            <CardBody className="items-center justify-center">
              <p>{piece}</p>
            </CardBody>
          </Card>
        </PopoverTrigger>
        <PopoverContent>
          <div className="px-1 py-2">
            <div className="text-small font-bold">Popover Content</div>
            <div className="text-tiny">This is the popover content</div>
            <div className="flex justify-center pt-2">
              <Button color="primary" onClick={startLesson}>
                Start
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
