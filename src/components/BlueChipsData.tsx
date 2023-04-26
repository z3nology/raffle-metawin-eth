import Card from "./Card";

export default function BlueChipsData() {
  return (
    <div className="mt-20 min-h-[20vh]">
      <h1 className="block mb-2 text-lg font-bold leading-none tracking-wider text-white uppercase lg:text-2xl category-title">
        blue chips
      </h1>
      <div className="grid w-full grid-cols-2 gap-2 py-5 lg:gap-5 xl:grid-cols-7 lg:grid-cols-4 md:grid-cols-3">
        {blueChipData?.map((data, index) => (
          <Card
            key={index}
            fileSrc={data.src}
            type={data.type}
            name={data.name}
            price={data.price}
            entries={data.entries}
          />
        ))}
      </div>
    </div>
  );
}

const blueChipData = [
  {
    src: "https://i.seadn.io/gcs/files/1b097aa129c54e47c23fb368766e00a5.png?w=350&auto=format",
    type: "image",
    name: "Head to Head - 0.5ETH",
    price: "1000",
    entries: "1 OF 2 MAX ENTRIES",
  },
  {
    src: "https://i.seadn.io/gcs/files/1cab04d749c901a29fbad11e95cd6f33.png?w=350&auto=format1",
    type: "image",
    name: "Head to Head - 0.5ETH",
    price: "1000",
    entries: "1 OF 2 MAX ENTRIES",
  },
];
