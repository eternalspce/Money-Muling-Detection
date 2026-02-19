export function formatOutput(suspicious,rings,total,ms){

  return {
    suspicious_accounts:suspicious,
    fraud_rings:rings,
    summary:{
      total_accounts_analyzed:total,
      suspicious_accounts_flagged:suspicious.length,
      fraud_rings_detected:rings.length,
      processing_time_seconds:+(ms/1000).toFixed(2)
    }
  };
}
