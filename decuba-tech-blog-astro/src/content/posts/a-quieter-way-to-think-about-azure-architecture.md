---
title: "A quieter way to think about Azure architecture"
date: 2026-09-02
category: "Microsoft Foundry"
description: "Notes from building systems that have to keep working after launch day."
featureImage: "/images/decuba-tech-hero.png"
published: true
series: "Working notes"
---

Architecture decisions rarely look dramatic when they are made. Their impact appears later, when a system has to change without becoming difficult to operate.

## The part worth keeping

A useful design leaves room for the next requirement without guessing what that requirement will be. That usually means fewer clever shortcuts and clearer boundaries between the parts that change often and the parts that should stay boring.

## My current read

The strongest Azure architecture is often the one that gives the team fewer surprises six months later. That is a less exciting story than a new service announcement, but it is the one I would rather build on.
