import { useState, useEffect } from "react";
import NumForm from "./numForm";
export default function TaxDeductionForm({ handletokubetsukuminZeigakuKojo, handletominZeigakuKojo, kazeiHyojunKingaku, kyuyoSyotokuKingaku }:
    { handletokubetsukuminZeigakuKojo: any; handletominZeigakuKojo: any; kazeiHyojunKingaku: number; kyuyoSyotokuKingaku: number }) {
    const [haitoKojo, sethaitoKojo] = useState<number>(0);
    const [jutakuloanKojo, setjutakuloanKojo] = useState<number>(0);
    const [kifukinKojo, setkifukinKojo] = useState<number>(0);
    const [furusatoNozei, setfurusatoNozei] = useState<number>(0);
    //（５）税額控除の計算
    //調整控除
    let choseiKojo: number = calcChoseiKojo(kazeiHyojunKingaku, kyuyoSyotokuKingaku);

    //寄附金控除
    let kifukinKojoTotal = (kifukinKojo - 2000) * 0.1;

    //税額控除金額を算出し、親に渡す。
    let tokubetsukuminZeigakuKojoTotal: number = 0;
    let tominZeigakuKojoTotal: number = 0;
    useEffect(() => {
        handletokubetsukuminZeigakuKojo(tokubetsukuminZeigakuKojoTotal);
    }, [tokubetsukuminZeigakuKojoTotal]);
    useEffect(() => {
        handletominZeigakuKojo(tominZeigakuKojoTotal);
    }, [tominZeigakuKojoTotal]);

    return (
        <section>
            <ul>
                <li>特別区民税：{tokubetsukuminZeigakuKojoTotal}</li>
                <li>都民税：{tominZeigakuKojoTotal}</li>
            </ul>
            <h3>調整控除</h3>
            <ul>
                <li>特別区民税：{choseiKojo * 0.03}</li>
                <li>都民税：{choseiKojo * 0.02}</li>
            </ul>
            <h3>寄付金税額控除</h3>
            <NumForm data={kifukinKojo} setDataState={setkifukinKojo}></NumForm>
        </section>
    );
}
function calcChoseiKojo(kazeiHyojunKingaku: number, kyuyoSyotokuKingaku: number): number {
    //人的基礎控除差額
    const kazeiHyojun_Threshold: number = 2000000;//課税標準額の閾値
    let jintekiKojoSagaku: number = kyuyoSyotokuKingaku <= 25000000 ? 5 : 0;
    let kojoSagaku_base: number = 0;

    if (kazeiHyojunKingaku <= kazeiHyojun_Threshold) {
        kojoSagaku_base = Math.min(jintekiKojoSagaku, kazeiHyojunKingaku)
        return kojoSagaku_base * 0.05;
    } else {
        kojoSagaku_base = jintekiKojoSagaku - (kazeiHyojunKingaku - kazeiHyojun_Threshold)
        return Math.max(kojoSagaku_base * 0.05, 2500);
    }
}
class zeigakuKojo {
    chosei: number;
    haito: number;
    jutakuloan: number;
    kifukin: number;
    furusato: number;
    syotoku: number;
    constructor(chosei: number, haito: number, jutakuloan: number, kifukin: number, furusato: number, syotoku: number) {
        this.chosei = chosei;
        this.haito = haito;
        this.jutakuloan = jutakuloan;
        this.kifukin = kifukin;
        this.furusato = furusato;

        this.syotoku = syotoku;
        // if(this.kifukin + this.furusato > (this.syotoku * 0.3)){
        //     this.kifukin = this.syotoku * 0.3;
        // }else{
        //     this.kifukin = this.kifukin + this.furusato;
        // }
        //NOTE:所得*0.3とふるさと納税のうち小さいほうを寄付金として算出するから以下のように書ける？？
        this.kifukin = Math.min((this.kifukin + this.furusato), this.syotoku * 0.3);

    }
    gettokubetsukuminZeigakuKojoTotal() {
        let tokubetsukuminZeigakuKojoTotal: number =
            this.chosei * 0.03 +
            this.kifukin * 0.06;
        return tokubetsukuminZeigakuKojoTotal;
    }
}