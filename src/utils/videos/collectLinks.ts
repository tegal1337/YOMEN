export async function collectLinks(page) {
    const videoLinks = await page.$$eval(
            "ytd-video-renderer a#thumbnail",
            (anchors: HTMLAnchorElement[]) => {
              return anchors
                .map((anchor) => anchor.href)
                .filter((href) => href);
            },
          );

    return videoLinks;
}