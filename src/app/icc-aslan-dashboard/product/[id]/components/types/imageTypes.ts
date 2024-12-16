export type imageProps = {
  name: string;
  src: string;
  content: File | null;
  type: string;
  filename: string;
};

export type imageListProps = imageProps[];
