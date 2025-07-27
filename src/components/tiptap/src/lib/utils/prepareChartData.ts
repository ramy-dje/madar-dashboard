import isPieLike from "./isPieLike";

function prepareChartData(chartType: string, rows: any) {
  const updatedData = rows.map((row: any, index: number) => {
    const numericValues = row.values.map((val: any) => +val);
    if (isPieLike(chartType)) {
      return numericValues;
    }
    return {
      name: row.name,
      data: numericValues,
    };
  });
  if (isPieLike(chartType)) {
    console.log("pie");
    return updatedData[0];
  } else {
    console.log("not pie");
    return updatedData;
  }
}

export default prepareChartData;
