function Sponsored() {
  const sponsors = [
    {
      src: "https://cdn-icons-png.flaticon.com/128/5969/5969151.png",
      alt: "Sponsor 1",
    },
    {
      src: "https://logos-world.net/wp-content/uploads/2020/08/Dell-Logo-1989-2016.png",
      alt: "Sponsor 2",
    },
    {
      src: "https://kreafolk.com/cdn/shop/articles/lg-logo-design-history-and-evolution-kreafolk_03aeb70a-1702-4330-a3d7-91c344688e97.jpg?v=1717725016&width=2048",
      alt: "Sponsor 3",
    },
    {
      src: "https://media.licdn.com/dms/image/D4D12AQHwi4jdRd3fQQ/article-cover_image-shrink_600_2000/0/1685279753620?e=2147483647&v=beta&t=7I-pJ0kDQfNl4w-0Ue8aPyol_X-aWOQlzp18NhTldys",
      alt: "Sponsor 4",
    },
    {
      src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQklDe2tAH31T4ifJrWGfkjvQhm3nniLP_TsA&s",
      alt: "Sponsor 5",
    },
    {
      src: "https://cdn.vox-cdn.com/thumbor/2ECtQus43_-tjqtlxy0WE8peSEQ=/0x0:2012x1341/1400x1050/filters:focal(1006x670:1007x671)/cdn.vox-cdn.com/uploads/chorus_asset/file/15483559/google2.0.0.1441125613.jpg",
      alt: "Sponsor 6",
    },
    {
      src: "https://logowik.com/content/uploads/images/microsoft-azure7662.jpg",
      alt: "Sponsor 7",
    },
  ];

  return (
    <div className="mb-12">
      <div className="section">
        <div className="rounded-md p-6 bg-white shadow-sm flex items-center gap-4 flex-wrap sm:justify-between">
          {sponsors.map((sponsor, index) => (
            <div
              key={index}
              className="w-20 md:w-24 lg:w-32 p-2 transform transition duration-300 ease-in-out hover:scale-110"
            >
              <img
                src={sponsor.src}
                alt={sponsor.alt}
                className="w-full h-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sponsored;