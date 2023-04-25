import Card from "./Card";

export default function BlueChipsData() {
  return (
    <div className="mt-20 min-h-[20vh]">
      <h1 className="uppercase block font-bold tracking-wider text-lg lg:text-2xl leading-none category-title mb-2 text-white">
        blue chips
      </h1>
      <div className="w-full py-5 grid grid-cols-7">
        <Card />
      </div>
    </div>
  );
}
