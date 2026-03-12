import { nanoid } from "nanoid";
import Product from "../entities/Product";

const ID_LENGTH = 6;

function ProductConstructor(args: Omit<Product, "id">) {
  return { id: nanoid(ID_LENGTH), ...args };
}

let products: Product[] = [
  ProductConstructor({
    title: "Фарфоровая чашка",
    category: "Посуда",
    price: 1400,
  }),
  ProductConstructor({
    title: "Серебряная ложка",
    category: "Посуда",
    price: 1500,
  }),
  ProductConstructor({
    title: "Ноутбук Pro",
    category: "Электроника",
    price: 120000,
    description: "Высокая производительность для работы и игр",
  }),
  ProductConstructor({
    title: "Смартфон X",
    category: "Электроника",
    price: 80000,
  }),
  ProductConstructor({
    title: "Наушники беспроводные",
    category: "Электроника",
    price: 15000,
    description: "Шумоподавление и 20 часов работы",
  }),
  ProductConstructor({
    title: "Книга: Война и мир",
    category: "Книги",
    price: 1200,
  }),
  ProductConstructor({
    title: "Книга: Преступление и наказание",
    category: "Книги",
    price: 900,
  }),
  ProductConstructor({
    title: "Футболка белая",
    category: "Одежда",
    price: 2000,
  }),
  ProductConstructor({
    title: "Джинсы классические",
    category: "Одежда",
    price: 5000,
    description: "Плотный деним, прямой крой",
  }),
  ProductConstructor({
    title: "Кроссовки беговые",
    category: "Одежда",
    price: 8000,
  }),
  ProductConstructor({
    title: "Кофеварка автоматическая",
    category: "Дом",
    price: 45000,
    description: "Встроенная мельница и капучинатор",
  }),
  ProductConstructor({
    title: "Тостер",
    category: "Дом",
    price: 3000,
  }),
  ProductConstructor({
    title: "Чайник электрический",
    category: "Дом",
    price: 2500,
  }),
  ProductConstructor({
    title: "Лампа настольная",
    category: "Дом",
    price: 1800,
    description: "Светодиодная, регулируемая яркость",
  }),
  ProductConstructor({
    title: "Рюкзак городской",
    category: "Аксессуары",
    price: 4000,
  }),
  ProductConstructor({
    title: "Часы наручные",
    category: "Аксессуары",
    price: 12000,
    description: "Механические, водонепроницаемые",
  }),
  ProductConstructor({
    title: "Очки солнцезащитные",
    category: "Аксессуары",
    price: 3500,
  }),
  ProductConstructor({
    title: "Мышь компьютерная",
    category: "Электроника",
    price: 2500,
  }),
  ProductConstructor({
    title: "Клавиатура механическая",
    category: "Электроника",
    price: 7000,
    description: "Переключатели Blue, подсветка",
  }),
  ProductConstructor({
    title: "Монитор 27 дюймов",
    category: "Электроника",
    price: 25000,
  }),
  ProductConstructor({
    title: "Стол письменный",
    category: "Мебель",
    price: 15000,
    description: "Дерево, ящики для хранения",
  }),
  ProductConstructor({
    title: "Стул офисный",
    category: "Мебель",
    price: 8000,
  }),
  ProductConstructor({
    title: "Диван трехместный",
    category: "Мебель",
    price: 40000,
    description: "Ткань велюр, механизм раскладывания",
  }),
  ProductConstructor({
    title: "Шкаф купе",
    category: "Мебель",
    price: 35000,
  }),
  ProductConstructor({
    title: "Тетрадь в клетку",
    category: "Канцелярия",
    price: 100,
  }),
  ProductConstructor({
    title: "Ручка шариковая",
    category: "Канцелярия",
    price: 50,
  }),
  ProductConstructor({
    title: "Калькулятор",
    category: "Канцелярия",
    price: 800,
    description: "Бухгалтерский, большой дисплей",
  }),
  ProductConstructor({
    title: "Сковорода антипригарная",
    category: "Кухня",
    price: 3000,
  }),
  ProductConstructor({
    title: "Нож кухонный",
    category: "Кухня",
    price: 1500,
    description: "Нержавеющая сталь, ergonomic ручка",
  }),
  ProductConstructor({
    title: "Набор посуды",
    category: "Кухня",
    price: 10000,
    description: "12 предметов, керамика",
  }),
];

export default products;
