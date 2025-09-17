// app/sss/page.tsx

import { type Metadata } from "next";
import { FaqAccordion } from "../_components/FaqAccordion";

export const metadata: Metadata = {
  title: "Sıkça Sorulan Sorular | Rentacar",
  description: "Araç kiralama süreciyle ilgili en çok sorulan sorular ve cevapları.",
};

// Soru ve cevaplarımızı burada bir dizi olarak tanımlıyoruz
const faqs = [
    {
        question: "Araç kiralamak için hangi belgelere ihtiyacım var?",
        answer: "Kiralama yapabilmek için geçerli bir sürücü belgesi (ehliyet), kimlik kartı (veya pasaport) ve kiracının adına düzenlenmiş geçerli bir kredi kartı gerekmektedir."
    },
    {
        question: "Kiraladığım aracı başkası kullanabilir mi?",
        answer: "Evet, ancak aracı kullanacak ek sürücünün de kiralama sözleşmesine kaydedilmesi ve ana sürücü ile aynı yaş ve ehliyet kriterlerini karşılaması gerekmektedir. Bu hizmet ek ücrete tabidir."
    },
    {
        question: "Minimum kiralama yaşı ve ehliyet süresi nedir?",
        answer: "Ekonomik grup araçlar için en az 21 yaş ve 1 yıllık ehliyet, orta grup için 25 yaş ve 2 yıllık ehliyet, lüks grup için ise 27 yaş ve 3 yıllık ehliyet şartı aranmaktadır."
    },
    {
        question: "Depozito (provisyon) bedeli ne zaman iade edilir?",
        answer: "Kiralama başında kredi kartınızdan bloke edilen depozito bedeli, aracın sorunsuz bir şekilde iade edilmesinin ardından bankanızın işlem yoğunluğuna bağlı olarak genellikle 7-15 iş günü içerisinde kartınıza iade edilir."
    },
    {
        question: "Kaza anında ne yapmalıyım?",
        answer: "Kaza durumunda aracın yerini değiştirmeden derhal trafik polisi veya jandarmaya haber vererek resmi kaza ve alkol raporu tutturmanız, ardından 7/24 hizmet veren acil yardım hattımızı aramanız gerekmektedir."
    },
    {
        question: "Yakıt politikası nedir?",
        answer: "Araçlarımız 'Dolu Al / Dolu Bırak' politikası ile kiralanmaktadır. Deposu dolu olarak teslim edilen aracın, yine deposu dolu olarak iade edilmesi beklenir. Eksik yakıt ile iadelerde yakıt ücreti ve hizmet bedeli yansıtılır."
    }
];


export default function SSSPage() {
  return (
    <div className="bg-gray-800 text-white">
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Sıkça Sorulan Sorular
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Aklınıza takılan soruların cevaplarını burada bulabilirsiniz.
          </p>
        </div>
        
        {/* İnteraktif akordiyon bileşenimizi burada kullanıyoruz */}
        <FaqAccordion items={faqs} />

      </section>
    </div>
  );
}