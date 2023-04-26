import Card from "./Card";

export default function Head2HeadsData() {
  return (
    <div className="mt-20 min-h-[20vh]">
      <h1 className="block mb-2 text-lg font-bold leading-none tracking-wider text-white uppercase lg:text-2xl category-title">
        head to heads
      </h1>
      <div className="grid w-full grid-cols-2 gap-2 py-5 lg:gap-5 xl:grid-cols-7 lg:grid-cols-4 md:grid-cols-3">
        {headData?.map((data, index) => (
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

const headData = [
  {
    src: "https://content.prod.platform.metawin.com/games/H2h_v2_halfeth.mp4#t=0.1",
    type: "video",
    name: "Head to Head - 0.5ETH",
    price: "1000",
    entries: "1 OF 2 MAX ENTRIES",
  },
  {
    src: "https://content.prod.platform.metawin.com/games/H2h_v2_1eth.mp4#t=0.1",
    type: "video",
    name: "Head to Head - 0.5ETH",
    price: "1000",
    entries: "1 OF 2 MAX ENTRIES",
  },
];
