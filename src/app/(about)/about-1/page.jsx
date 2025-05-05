import Footer from "@/components/footer/Footer";
import Header20 from "@/components/header/Header20";
import CounterInfo1 from "@/components/section/CounterInfo1";
import CtaBanner1 from "@/components/section/CtaBanner1";
import OurCta1 from "@/components/section/OurCta1";
import OurPartner1 from "@/components/section/OurPartner1";
import PriceTable1 from "@/components/section/PriceTable1";
import Testimonial1 from "@/components/section/Testimonial1";

export const metadata = {
    title: "Fairlancer - Freelance Marketplace React/Next Js Template | About 1",
};

export default function page() {
    return (
        <>
            <Header20 />
            <CtaBanner1 />
            <CounterInfo1 />
            <Testimonial1 />
            <PriceTable1 />
            <OurPartner1 />
            <OurCta1 />
            <Footer />
        </>
    );
}
