const PRODUCT_SECTION_HEADING = '## 함께 보면 좋은 상품';
const SHOPPING_CONNECT_DISCLOSURE = '이 글은 네이버 쇼핑 커넥트 활동의 일환으로, 상품 구매 시 일정액의 수수료를 받을 수 있습니다.';

function assertShoppingConnectDisclosure(article) {
  if (typeof article !== 'string') {
    throw new Error('Article must be a string.');
  }

  const headingIndex = article.indexOf(PRODUCT_SECTION_HEADING);
  if (headingIndex === -1) {
    throw new Error(`Missing required section: ${PRODUCT_SECTION_HEADING}`);
  }

  const afterHeading = article.slice(headingIndex + PRODUCT_SECTION_HEADING.length);
  const disclosure = afterHeading.match(/^(?:\r?\n)+([^\r\n]*)/)?.[1];
  if (disclosure !== SHOPPING_CONNECT_DISCLOSURE) {
    throw new Error('Shopping Connect disclosure must exactly follow the product section heading.');
  }

  return article;
}

module.exports = {
  PRODUCT_SECTION_HEADING,
  SHOPPING_CONNECT_DISCLOSURE,
  assertShoppingConnectDisclosure,
};
