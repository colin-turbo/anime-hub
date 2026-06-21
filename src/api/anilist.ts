// AniList GraphQL client
const ANILIST = 'https://graphql.anilist.co';

async function gql<T>(query: string, vars: any = {}): Promise<T> {
  const r = await fetch(ANILIST, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query, variables: vars }) });
  const j = await r.json();
  if (j.errors) throw new Error(j.errors[0]?.message || 'GraphQL error');
  return j.data;
}

export async function searchAnime(params: any, page = 1, perPage = 20) {
  return gql(`query($q:String,$p:Int,$pp:Int,$g:[String],$y:Int,$s:MediaSeason,$f:MediaFormat,$st:MediaStatus,$so:[MediaSort]){Page(page:$p,perPage:$pp){pageInfo{total currentPage lastPage hasNextPage perPage}media(search:$q,genre_in:$g,seasonYear:$y,season:$s,format:$f,status:$st,sort:$so,type:ANIME,isAdult:false){id idMal title{romaji english native}coverImage{extraLarge large medium color}format status episodes duration season seasonYear averageScore meanScore popularity favourites genres studios{nodes{id name}}startDate{year month day}endDate{year month day}nextAiringEpisode{airingAt timeUntilAiring episode}}}}`,
    { q: params.query, p: page, pp: perPage, g: params.genres, y: params.year, s: params.season, f: params.format, st: params.status, so: params.sort ? [params.sort] : ['POPULARITY_DESC'] });
}

export async function getAnimeById(id: number) {
  return gql(`query($id:Int){Media(id:$id,type:ANIME){id idMal title{romaji english native}description(asHtml:false)coverImage{extraLarge large medium color}bannerImage format status episodes duration season seasonYear averageScore meanScore popularity favourites genres studios{nodes{id name}}startDate{year month day}endDate{year month day}nextAiringEpisode{airingAt timeUntilAiring episode}trailer{id site thumbnail}characters(sort:ROLE,perPage:12){edges{role node{id name{full native}image{large medium}}voiceActors(language:JAPANESE){id name{full native}image{large medium}language}}}relations{edges{relationType node{id title{romaji english native}coverImage{extraLarge large medium color}type format}}}}}`, { id });
}

export async function getTopAnime(sort = 'SCORE_DESC', page = 1, perPage = 30) {
  return gql(`query($p:Int,$pp:Int,$s:[MediaSort]){Page(page:$p,perPage:$pp){pageInfo{total currentPage lastPage hasNextPage perPage}media(type:ANIME,sort:$s){id idMal title{romaji english native}coverImage{extraLarge large medium color}format averageScore popularity favourites genres season seasonYear episodes}}}`, { p: page, pp: perPage, s: [sort] });
}

export async function getSeasonalAnime(season: string, year: number, page = 1, perPage = 30) {
  return gql(`query($p:Int,$pp:Int,$s:MediaSeason,$y:Int){Page(page:$p,perPage:$pp){pageInfo{total currentPage lastPage hasNextPage perPage}media(type:ANIME,season:$s,seasonYear:$y,sort:POPULARITY_DESC){id idMal title{romaji english native}coverImage{extraLarge large medium color}format status episodes averageScore popularity genres nextAiringEpisode{airingAt timeUntilAiring episode}}}}`, { p: page, pp: perPage, s: season, y: year });
}

export async function getAiringSchedule(weekStart: number, weekEnd: number, page = 1, perPage = 50) {
  return gql(`query($p:Int,$pp:Int,$ws:Int,$we:Int){Page(page:$p,perPage:$pp){pageInfo{total currentPage lastPage hasNextPage perPage}airingSchedules(airingAt_greater:$ws,airingAt_lesser:$we,sort:TIME){id airingAt episode timeUntilAiring media{id idMal title{romaji english native}coverImage{extraLarge large medium color}format episodes averageScore}}}}`, { p: page, pp: perPage, ws: weekStart, we: weekEnd });
}
