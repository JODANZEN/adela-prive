/* ------------------------------------------------------------------
   The collection — taken from @adelaprive.design posts.
   - Names and sizes come from her Instagram captions. Descriptions are
     drafts written from the photos: ask her to check them.
   - Photos live in assets/products/<id>/. The first one is the main
     photo; the second shows on hover in the grid.
   - status: "available" | "made-to-order" | "sold"
     (sold pieces stay on the site with a label; enquiries ask for a similar one)
   - featured: true  → shown on the home page (up to 4)
   - hero: true      → its first photo fills the big frame on the home page
   ------------------------------------------------------------------ */
(function () {
  const pics = (id, n) => Array.from({ length: n }, (_, i) => "assets/products/" + id + "/" + (i + 1) + ".webp");
  const TBD = { en: "", bg: "" };

  window.PRODUCTS = [
    {
      id: "ap-01", category: "scarves", status: "available", hero: true,
      images: pics("ap-01", 5),
      name: { en: "Burgundy Scarf", bg: "Шал в бордо" },
      description: {
        en: "A long, chunky scarf in deep burgundy, finished with a fringe at each end. Made for the coldest days.",
        bg: "Дълъг, обемен шал в наситено бордо, завършен с ресни в двата края. За най-студените дни."
      },
      details: { material: TBD, dimensions: TBD, colour: { en: "Burgundy", bg: "Бордо" } }
    },
    {
      id: "ap-02", category: "purses", status: "available", featured: true,
      images: pics("ap-02", 4),
      name: { en: "Black Triangle Tote", bg: "Черна триъгълна чанта" },
      description: {
        en: "A soft triangle tote in black with long, loose fringe handles that fall past the bag.",
        bg: "Мека триъгълна чанта в черно с дълги свободни ресни, които се спускат под чантата."
      },
      details: { material: TBD, dimensions: { en: "28 × 15 cm", bg: "28 × 15 см" }, colour: { en: "Black", bg: "Черно" } }
    },
    {
      id: "ap-03", category: "purses", status: "available", featured: true,
      images: pics("ap-03", 2),
      name: { en: "Bordeaux Japanese Knot Bag", bg: "Чанта „Японски възел“ в бордо" },
      description: {
        en: "A Japanese knot bag in bordeaux yarn with a glossy sheen, worn on the wrist, with a fringed base.",
        bg: "Чанта тип „японски възел“ от прежда в бордо с лек гланц. Носи се на китката и има ресни отдолу."
      },
      details: { material: TBD, dimensions: { en: "30 × 23 cm", bg: "30 × 23 см" }, colour: { en: "Bordeaux, glossy", bg: "Бордо с гланц" } }
    },
    {
      id: "ap-04", category: "purses", status: "available", featured: true,
      images: pics("ap-04", 2),
      name: { en: "Shell Purse", bg: "Чанта „Мида“" },
      description: {
        en: "A sculpted shell-shaped purse in ivory, with a movable handle.",
        bg: "Скулптурна чанта във формата на мида, в цвят слонова кост, с подвижна дръжка."
      },
      details: { material: TBD, dimensions: { en: "22 × 17 cm", bg: "22 × 17 см" }, colour: { en: "Ivory", bg: "Слонова кост" } }
    },
    {
      id: "ap-05", category: "purses", status: "available", featured: true,
      images: pics("ap-05", 2),
      name: { en: "Ring Handle Purse, Mint", bg: "Чанта с дръжки халки, мента" },
      description: {
        en: "A rounded mint-green purse carried on two polished metal ring handles.",
        bg: "Заоблена чанта в ментово зелено с две полирани метални дръжки халки."
      },
      details: { material: TBD, dimensions: { en: "22 × 18 cm", bg: "22 × 18 см" }, colour: { en: "Mint green", bg: "Ментово зелено" } }
    },
    {
      id: "ap-06", category: "purses", status: "available",
      images: pics("ap-06", 2),
      name: { en: "Snow White Purse", bg: "Снежнобяла чанта" },
      description: {
        en: "A structured shoulder purse in snow white, worked in a deep textured stitch.",
        bg: "Стегната чанта за рамо в снежнобяло, изработена с плътна релефна плетка."
      },
      details: { material: TBD, dimensions: { en: "23 × 12 cm", bg: "23 × 12 см" }, colour: { en: "Snow white", bg: "Снежнобяло" } }
    },
    {
      id: "ap-07", category: "purses", status: "available",
      images: pics("ap-07", 2),
      name: { en: "Baby Blue Bubble Bag", bg: "Светлосиня чанта „Балон“" },
      description: {
        en: "A playful bubble bag in baby blue, made from extra-chunky yarn.",
        bg: "Игрива чанта „балон“ в бебешко синьо, изработена от много обемна прежда."
      },
      details: { material: { en: "Chunky yarn", bg: "Обемна прежда" }, dimensions: { en: "27 × 35 cm", bg: "27 × 35 см" }, colour: { en: "Baby blue", bg: "Бебешко синьо" } }
    },
    {
      id: "ap-08", category: "purses", status: "available",
      images: pics("ap-08", 2),
      name: { en: "White & Silver Bucket Purse", bg: "Бяла чанта-торбичка със сребро" },
      description: {
        en: "A small drawstring bucket purse in white with a silver tint, carried on a beaded handle.",
        bg: "Малка чанта-торбичка с връзки, в бяло със сребрист отблясък и дръжка с мъниста."
      },
      details: { material: TBD, dimensions: { en: "16 × 18 cm", bg: "16 × 18 см" }, colour: { en: "White with silver tint", bg: "Бяло със сребрист отблясък" } }
    },
    {
      id: "ap-09", category: "purses", status: "available",
      images: pics("ap-09", 3),
      name: { en: "Lapis Blue Mini Purse", bg: "Мини чанта в лапис синьо" },
      description: {
        en: "A compact mini purse in lapis blue, with a chain strap for wearing across the body.",
        bg: "Компактна мини чанта в лапис синьо с верижка за носене през рамо."
      },
      details: { material: TBD, dimensions: { en: "20 × 15 cm", bg: "20 × 15 см" }, colour: { en: "Lapis blue", bg: "Лапис синьо" } }
    },
    {
      id: "ap-10", category: "purses", status: "available",
      images: pics("ap-10", 4),
      name: { en: "Red Wine Hobo Purse", bg: "Хобо чанта в червено вино" },
      description: {
        en: "A chunky hobo purse in red wine, with a silver clasp at the handle.",
        bg: "Обемна хобо чанта в цвят червено вино със сребриста закопчалка на дръжката."
      },
      details: { material: { en: "Chunky yarn", bg: "Обемна прежда" }, dimensions: { en: "32 × 13 × 13 cm", bg: "32 × 13 × 13 см" }, colour: { en: "Red wine", bg: "Червено вино" } }
    },
    {
      id: "ap-11", category: "purses", status: "available",
      images: pics("ap-11", 4),
      name: { en: "Lapis Blue Fringe Mini Tote", bg: "Мини чанта с ресни в лапис синьо" },
      description: {
        en: "A mini tote in lapis blue with long fringe falling from the base. Carry it by hand or over the shoulder.",
        bg: "Мини чанта в лапис синьо с дълги ресни отдолу. Носи се в ръка или на рамо."
      },
      details: { material: TBD, dimensions: { en: "20 × 15 cm", bg: "20 × 15 см" }, colour: { en: "Lapis blue", bg: "Лапис синьо" } }
    },
    {
      id: "ap-12", category: "purses", status: "available",
      images: pics("ap-12", 4),
      name: { en: "Coffee Brown Top Handle Purse", bg: "Кафява чанта с дръжки" },
      description: {
        en: "A coffee-brown purse with rounded top handles, roomy enough for a phone and the essentials.",
        bg: "Чанта в кафяво с кръгли дръжки, достатъчно просторна за телефон и най-необходимото."
      },
      details: { material: TBD, dimensions: { en: "22 × 13 × 9 cm", bg: "22 × 13 × 9 см" }, colour: { en: "Coffee brown", bg: "Кафяво" } }
    },
    {
      id: "ap-13", category: "purses", status: "available",
      images: pics("ap-13", 3),
      name: { en: "Dusty Rose Clutch", bg: "Клъч в пепелява роза" },
      description: {
        en: "A soft, rounded clutch in dusty rose with a lined interior. Held in the hand for evenings out.",
        bg: "Мек, заоблен клъч в цвят пепелява роза с хастар отвътре. Носи се в ръка за вечер навън."
      },
      details: { material: TBD, dimensions: { en: "32 × 13 × 13 cm", bg: "32 × 13 × 13 см" }, colour: { en: "Dusty rose", bg: "Пепелява роза" } }
    },
    {
      id: "ap-14", category: "purses", status: "available",
      images: pics("ap-14", 3),
      name: { en: "Sand Beige Mini Shopper", bg: "Мини чанта шопър в пясъчно бежово" },
      description: {
        en: "A small shopper in sand beige with cut-out handles, worked in a thick, sculpted stitch.",
        bg: "Малка чанта шопър в пясъчно бежово с изрязани дръжки, изработена с плътна релефна плетка."
      },
      details: { material: TBD, dimensions: { en: "20 × 15 × 9 cm", bg: "20 × 15 × 9 см" }, colour: { en: "Sand beige", bg: "Пясъчно бежово" } }
    }
  ];
})();
