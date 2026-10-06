export const formatPHP = (n) =>
  '₱' + Number(n || 0).toLocaleString('en-PH', { maximumFractionDigits: 0 })

export const helmetImages = {}
