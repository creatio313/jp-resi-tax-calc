/**
 * NumForm コンポーネント
 * @param data 現在の数値データ
 * @param setDataState 親コンポーネントから渡される state 更新関数
 * @returns setDataState関数（関数は引数で指定）
 */
export default function NumForm({ data, setDataState }: { data: number; setDataState: any }) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 文字列を整数に変換
    const parsedValue = parseInt(value.replace(/^0+/, ''), 10);

    // 変換結果が NaN (数字以外) の場合は 0 をセットし、それ以外は変換後の数値をセットする
    if (isNaN(parsedValue)) {
      setDataState(0);
    } else {
      setDataState(parsedValue);
    }
  };

  return (
    <input
      type="number"
      value={data}
      onChange={handleChange}
    />
  );
}