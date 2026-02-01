import { useState, useEffect } from "react";
import NumForm from "./numForm";
export default function IncomeDeductionForm({ handleshotokuKojoKingaku, kyuyoSyotokuKingaku }:
    { handleshotokuKojoKingaku: any; kyuyoSyotokuKingaku: number }) {
    const [syakaiHokenRyoKojo, setsyakaiHokenRyoKojo] = useState<number>(0);
    const [iDeCo, setiDeCo] = useState<number>(0);
    const [kaigoIryoHokenRyoKojo, setkaigoIryoHokenRyoKojo] = useState<number>(0);
    const [ippanSeimeiHokenRyoKojo, setippanSeimeiHokenRyoKojo] = useState<number>(0);
    const [kojinNenkinHokenRyoKojo, setkojinNenkinHokenRyoKojo] = useState<number>(0);
    const [jishinHokenRyo, setjishinHokenRyo] = useState<number>(0);

    //（２）所得控除額の計算

    //基礎控除の計算
    let kisoKojo: number = calcKisoKojo(kyuyoSyotokuKingaku);

    //生命保険料控除の計算
    let seimeihokenRyoKojoTotal =
        calcSeimeiHokenRyoKojo(kaigoIryoHokenRyoKojo) +
        calcSeimeiHokenRyoKojo(ippanSeimeiHokenRyoKojo) +
        calcSeimeiHokenRyoKojo(kojinNenkinHokenRyoKojo);

    const seimeihokenRyo_KojoGendo = 70000;//控除限度額

    let seimeiHokenRyoKojo = Math.min(seimeihokenRyoKojoTotal, seimeihokenRyo_KojoGendo);

    //地震保険料の計算

    const jishinHokenRyo_KojoGendo = 25000;//控除限度額

    let jishinHokenRyoKojo = Math.min(jishinHokenRyo / 2, jishinHokenRyo_KojoGendo);

    //所得控除金額を算出し、親に渡す。
    let syotokuKojoTotal: number = 0;
    syotokuKojoTotal =
        kisoKojo +
        syakaiHokenRyoKojo +
        iDeCo +
        seimeiHokenRyoKojo +
        jishinHokenRyoKojo;

    useEffect(() => {
        handleshotokuKojoKingaku(syotokuKojoTotal);
    }, [syotokuKojoTotal]);

    return (
        <section>
            <h3>基礎控除</h3>
            <p>{kisoKojo}</p>
            <h3>社会保険料控除</h3>
            <NumForm data={syakaiHokenRyoKojo} setDataState={setsyakaiHokenRyoKojo}></NumForm>
            <h3>小規模企業共済等掛金控除</h3>
            <NumForm data={iDeCo} setDataState={setiDeCo}></NumForm>
            <h3>生命保険料控除</h3>
            <h4>介護医療保険料控除</h4>
            <NumForm data={kaigoIryoHokenRyoKojo} setDataState={setkaigoIryoHokenRyoKojo}></NumForm>
            <h4>一般生命保険料控除</h4>
            <NumForm data={ippanSeimeiHokenRyoKojo} setDataState={setippanSeimeiHokenRyoKojo}></NumForm>
            <h4>個人年金保険料控除</h4>
            <NumForm data={kojinNenkinHokenRyoKojo} setDataState={setkojinNenkinHokenRyoKojo}></NumForm>
            <p>合計額：{seimeiHokenRyoKojo}</p>
            <p>
                <small>平成24年1月1日以後に締結した保険契約等にのみ対応</small>
            </p>
            <h3>地震保険料控除</h3>
            <NumForm data={jishinHokenRyo} setDataState={setjishinHokenRyo}></NumForm>
            <p>
                <small>平成18年までに締結した長期損害保険料には非対応</small>
            </p>
        </section>
    );
}
//所得金額から基礎控除を判定する。
function calcKisoKojo(kyuyoSyotokuKingaku: number): number {
    if (kyuyoSyotokuKingaku <= 24000000) {
        return 430000;
    } else if (kyuyoSyotokuKingaku <= 24500000) {
        return 290000;
    } else if (kyuyoSyotokuKingaku <= 25000000) {
        return 150000;
    } else {
        return 0;
    }
}
//生命保険料から生命保険料控除を計算する。
function calcSeimeiHokenRyoKojo(inputtedHokenRyo: number): number {
    if (inputtedHokenRyo <= 12000) {
        return inputtedHokenRyo;
    } else if (inputtedHokenRyo <= 32000) {
        return inputtedHokenRyo / 2 + 6000;
    } else if (inputtedHokenRyo <= 56000) {
        return inputtedHokenRyo / 4 + 14000;
    } else {
        return 28000;
    }
}