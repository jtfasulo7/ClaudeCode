import React from 'react';
import { Composition } from 'remotion';
import { SIZE, DURATION } from './tokens';

import { F01_WebsiteToSms } from './compositions/F01_WebsiteToSms';
import { F02_MissedCall   } from './compositions/F02_MissedCall';
import { F03_Reviews      } from './compositions/F03_Reviews';
import { F04_DeadLeads    } from './compositions/F04_DeadLeads';
import { F05_Dashboard    } from './compositions/F05_Dashboard';

const C = {
  width:        SIZE.width,
  height:       SIZE.height,
  fps:          SIZE.fps,
  durationInFrames: DURATION,
};

export const Root: React.FC = () => (
  <>
    <Composition id="F01-WebsiteToSms" component={F01_WebsiteToSms} {...C} />
    <Composition id="F02-MissedCall"   component={F02_MissedCall}   {...C} />
    <Composition id="F03-Reviews"      component={F03_Reviews}      {...C} />
    <Composition id="F04-DeadLeads"    component={F04_DeadLeads}    {...C} />
    <Composition id="F05-Dashboard"    component={F05_Dashboard}    {...C} />
  </>
);
